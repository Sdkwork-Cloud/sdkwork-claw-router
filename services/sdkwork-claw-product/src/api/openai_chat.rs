use std::pin::Pin;
use std::sync::Arc;
use std::task::{Context, Poll};
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::{Body, Bytes, HttpBody};
use axum::extract::State;
use axum::http::header::CONTENT_TYPE;
use axum::http::{HeaderMap, StatusCode, Uri};
use axum::response::{IntoResponse, Response};
use axum::routing::post;
use axum::{Json, Router};
use hyper::body::Frame;
use sdkwork_claw_http::ApiKeyIdentity;
use serde_json::Value;

use crate::api::openai_contract::OpenAiChatCompletionRequest;
use crate::api::openai_error::openai_error;
use crate::api::openai_runtime::{authenticate_api_key, first_priced_provider_route};
use crate::application::{
    ApiKeySecretHasher, AuthenticatedApiKeyContext, PricingResolver, ResolveModelPriceQuery,
};
use crate::domain::{BillingMeter, DecimalValue, DomainError, DomainResult, ModelProviderRoute};
use crate::ports::GatewayUsageRecordFuture;
use crate::ports::{
    ChatCompletionRelay, ChatCompletionRelayRequest, ChatCompletionStreamRelay,
    GatewayUsageRecordCommand, GatewayUsageRecorder, PricingCatalog,
};

const X_REQUEST_ID: &str = "x-request-id";
const X_TRACE_ID: &str = "x-trace-id";

struct OpenAiChatState<C> {
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Option<Arc<dyn ChatCompletionRelay + Send + Sync>>,
    stream_relay: Option<Arc<dyn ChatCompletionStreamRelay + Send + Sync>>,
    usage_recorder: Option<Arc<dyn GatewayUsageRecorder + Send + Sync>>,
}

impl<C> Clone for OpenAiChatState<C> {
    fn clone(&self) -> Self {
        Self {
            catalog: Arc::clone(&self.catalog),
            api_key_hasher: Arc::clone(&self.api_key_hasher),
            relay: self.relay.clone(),
            stream_relay: self.stream_relay.clone(),
            usage_recorder: self.usage_recorder.clone(),
        }
    }
}

struct ParsedOpenAiChatCompletionRequest {
    model: String,
    stream: bool,
    request_body: Value,
}

pub fn openai_chat_completions_router<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_chat_completions_router_with_optional_relays(catalog, api_key_hasher, None, None, None)
}

pub fn openai_chat_completions_router_with_relay<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Arc<dyn ChatCompletionRelay + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_chat_completions_router_with_optional_relays(
        catalog,
        api_key_hasher,
        Some(relay),
        None,
        None,
    )
}

pub fn openai_chat_completions_router_with_relay_and_usage_recorder<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Arc<dyn ChatCompletionRelay + Send + Sync>,
    usage_recorder: Arc<dyn GatewayUsageRecorder + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_chat_completions_router_with_optional_relays(
        catalog,
        api_key_hasher,
        Some(relay),
        None,
        Some(usage_recorder),
    )
}

pub fn openai_chat_completions_router_with_streaming_relay<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    stream_relay: Arc<dyn ChatCompletionStreamRelay + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_chat_completions_router_with_optional_relays(
        catalog,
        api_key_hasher,
        None,
        Some(stream_relay),
        None,
    )
}

pub fn openai_chat_completions_router_with_relays<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Arc<dyn ChatCompletionRelay + Send + Sync>,
    stream_relay: Arc<dyn ChatCompletionStreamRelay + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_chat_completions_router_with_optional_relays(
        catalog,
        api_key_hasher,
        Some(relay),
        Some(stream_relay),
        None,
    )
}

pub fn openai_chat_completions_router_with_relays_and_usage_recorder<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Arc<dyn ChatCompletionRelay + Send + Sync>,
    stream_relay: Arc<dyn ChatCompletionStreamRelay + Send + Sync>,
    usage_recorder: Arc<dyn GatewayUsageRecorder + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_chat_completions_router_with_optional_relays(
        catalog,
        api_key_hasher,
        Some(relay),
        Some(stream_relay),
        Some(usage_recorder),
    )
}

fn openai_chat_completions_router_with_optional_relays<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Option<Arc<dyn ChatCompletionRelay + Send + Sync>>,
    stream_relay: Option<Arc<dyn ChatCompletionStreamRelay + Send + Sync>>,
    usage_recorder: Option<Arc<dyn GatewayUsageRecorder + Send + Sync>>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    Router::new()
        .route("/v1/chat/completions", post(create_chat_completion::<C>))
        .with_state(OpenAiChatState {
            catalog,
            api_key_hasher,
            relay,
            stream_relay,
            usage_recorder,
        })
}

async fn create_chat_completion<C>(
    State(state): State<OpenAiChatState<C>>,
    headers: HeaderMap,
    uri: Uri,
    body: Bytes,
) -> Response
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let request = match parse_request(&body) {
        Ok(request) => request,
        Err(message) => {
            return openai_error(
                StatusCode::BAD_REQUEST,
                "invalid_request",
                "invalid_request_error",
                message,
            )
        }
    };
    let identity = match ApiKeyIdentity::from_headers_and_uri(&headers, &uri) {
        Ok(identity) => identity,
        Err(error) => {
            return openai_error(
                StatusCode::BAD_REQUEST,
                "invalid_request",
                "invalid_request_error",
                error,
            )
        }
    };
    let context = match authenticate_api_key(
        state.catalog.as_ref(),
        state.api_key_hasher.as_ref(),
        &identity,
    ) {
        Ok(context) => context,
        Err(response) => return *response,
    };
    let route = match first_priced_provider_route(
        state.catalog.as_ref(),
        &context,
        &request.model,
        BillingMeter::LlmInputToken,
    ) {
        Ok(route) => route,
        Err(response) => return *response,
    };

    if request.stream {
        let Some(stream_relay) = state.stream_relay.as_ref() else {
            return openai_error(
                StatusCode::NOT_IMPLEMENTED,
                "streaming_relay_not_configured",
                "server_error",
                "streaming provider relay is not implemented for /v1/chat/completions",
            );
        };
        return match relay_chat_completion_stream(
            stream_relay.as_ref(),
            state.catalog.as_ref(),
            state.usage_recorder.clone(),
            &headers,
            &uri,
            context,
            route,
            request,
        )
        .await
        {
            Ok(response) => response,
            Err(response) => response,
        };
    }

    let Some(relay) = state.relay.as_ref() else {
        return openai_error(
            StatusCode::NOT_IMPLEMENTED,
            "provider_relay_not_configured",
            "server_error",
            "provider relay is not implemented for /v1/chat/completions",
        );
    };

    match relay_chat_completion(
        state.catalog.as_ref(),
        relay.as_ref(),
        state.usage_recorder.as_deref(),
        &headers,
        &uri,
        context,
        route,
        request,
    )
    .await
    {
        Ok(response) => response,
        Err(response) => response,
    }
}

fn parse_request(body: &[u8]) -> Result<ParsedOpenAiChatCompletionRequest, String> {
    let request_body: Value =
        serde_json::from_slice(body).map_err(|error| format!("invalid request body: {error}"))?;
    let request: OpenAiChatCompletionRequest = serde_json::from_value(request_body.clone())
        .map_err(|error| format!("invalid request body: {error}"))?;
    if request.model.trim().is_empty() {
        return Err("model is required".to_owned());
    }
    if request.messages.is_empty() {
        return Err("messages is required".to_owned());
    }
    Ok(ParsedOpenAiChatCompletionRequest {
        model: request.model,
        stream: request.stream.unwrap_or(false),
        request_body,
    })
}

async fn relay_chat_completion_stream(
    relay: &(dyn ChatCompletionStreamRelay + Send + Sync),
    catalog: &(impl PricingCatalog + Send + Sync),
    usage_recorder: Option<Arc<dyn GatewayUsageRecorder + Send + Sync>>,
    headers: &HeaderMap,
    uri: &Uri,
    context: AuthenticatedApiKeyContext,
    route: ModelProviderRoute,
    request: ParsedOpenAiChatCompletionRequest,
) -> Result<Response, Response> {
    let requested_model = request.model.clone();
    let response = relay
        .create_chat_completion_stream(ChatCompletionRelayRequest {
            api_key_id: context.api_key_id,
            group_id: context.group_id,
            group_code: context.group_code.clone(),
            pricing_plan_code: context.pricing_plan_code.clone(),
            model: request.model.clone(),
            provider_code: route.provider_code.clone(),
            provider_model: route.provider_model.clone(),
            provider_base_url: route.base_url.clone(),
            provider_secret_ref: route.secret_ref.clone(),
            provider_timeout_ms: route.timeout_ms,
            provider_retry_policy: route.retry_policy.clone(),
            request_body: request.request_body,
        })
        .await
        .map_err(|error| {
            openai_error(
                StatusCode::BAD_GATEWAY,
                "provider_stream_relay_failed",
                "server_error",
                error,
            )
        })?;

    let status = StatusCode::from_u16(response.status_code).map_err(|_| {
        openai_error(
            StatusCode::BAD_GATEWAY,
            "provider_relay_invalid_status",
            "server_error",
            "provider relay returned an invalid HTTP status",
        )
    })?;
    let mut builder = Response::builder().status(status);
    let content_type = response
        .content_type
        .unwrap_or_else(|| "text/event-stream".to_owned());
    builder = builder.header(CONTENT_TYPE, content_type);
    let body = match usage_recorder {
        Some(usage_recorder) if status.is_success() => {
            let command_builder = build_usage_record_command_builder(
                catalog,
                headers,
                uri,
                &context,
                &route,
                &requested_model,
                response.status_code,
                true,
            )
            .map_err(|error| {
                openai_error(
                    StatusCode::BAD_GATEWAY,
                    "provider_usage_record_failed",
                    "server_error",
                    error,
                )
            })?;
            Body::new(StreamingUsageRecordingBody::new(
                response.body,
                usage_recorder,
                command_builder,
            ))
        }
        _ => response.body,
    };
    builder.body(body).map_err(|_| {
        openai_error(
            StatusCode::BAD_GATEWAY,
            "provider_stream_relay_failed",
            "server_error",
            "provider stream relay returned an invalid response",
        )
    })
}

async fn relay_chat_completion(
    catalog: &(impl PricingCatalog + Send + Sync),
    relay: &(dyn ChatCompletionRelay + Send + Sync),
    usage_recorder: Option<&(dyn GatewayUsageRecorder + Send + Sync)>,
    headers: &HeaderMap,
    uri: &Uri,
    context: AuthenticatedApiKeyContext,
    route: ModelProviderRoute,
    request: ParsedOpenAiChatCompletionRequest,
) -> Result<Response, Response> {
    let requested_model = request.model.clone();
    let request_body = request.request_body;
    let response = relay
        .create_chat_completion(ChatCompletionRelayRequest {
            api_key_id: context.api_key_id,
            group_id: context.group_id,
            group_code: context.group_code.clone(),
            pricing_plan_code: context.pricing_plan_code.clone(),
            model: requested_model.clone(),
            provider_code: route.provider_code.clone(),
            provider_model: route.provider_model.clone(),
            provider_base_url: route.base_url.clone(),
            provider_secret_ref: route.secret_ref.clone(),
            provider_timeout_ms: route.timeout_ms,
            provider_retry_policy: route.retry_policy.clone(),
            request_body,
        })
        .await
        .map_err(|error| {
            openai_error(
                StatusCode::BAD_GATEWAY,
                "provider_relay_failed",
                "server_error",
                error,
            )
        })?;

    let status = StatusCode::from_u16(response.status_code).map_err(|_| {
        openai_error(
            StatusCode::BAD_GATEWAY,
            "provider_relay_invalid_status",
            "server_error",
            "provider relay returned an invalid HTTP status",
        )
    })?;
    if status.is_success() {
        let Some(usage_recorder) = usage_recorder else {
            return Ok((status, Json(response.body)).into_response());
        };
        let usage = chat_usage_from_response(&response.body).map_err(|error| {
            openai_error(
                StatusCode::BAD_GATEWAY,
                "provider_usage_record_failed",
                "server_error",
                error,
            )
        })?;
        let command = build_usage_record_command(
            catalog,
            headers,
            uri,
            &context,
            &route,
            &requested_model,
            response.status_code,
            false,
            usage,
        )
        .map_err(|error| {
            openai_error(
                StatusCode::BAD_GATEWAY,
                "provider_usage_record_failed",
                "server_error",
                error,
            )
        })?;
        usage_recorder
            .record_gateway_usage(command)
            .await
            .map_err(|error| {
                openai_error(
                    StatusCode::BAD_GATEWAY,
                    "provider_usage_record_failed",
                    "server_error",
                    error,
                )
            })?;
    }
    Ok((status, Json(response.body)).into_response())
}

#[derive(Debug, Clone)]
struct GatewayUsageRecordCommandBuilder {
    request_id: String,
    trace_id: Option<String>,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
    api_key_id: i64,
    api_key_name_snapshot: String,
    api_key_group_id: i64,
    api_key_group_snapshot: String,
    catalog_key: String,
    requested_model: String,
    provider_code: String,
    channel_id: i64,
    provider_model: String,
    request_path: String,
    http_method: String,
    http_status: u16,
    streaming: bool,
    base_input_unit_price: String,
    base_output_unit_price: String,
    input_unit_price: DecimalValue,
    output_unit_price: DecimalValue,
    upstream_input_unit_price: DecimalValue,
    upstream_output_unit_price: DecimalValue,
    currency: String,
    pricing_plan_code: String,
}

impl GatewayUsageRecordCommandBuilder {
    fn build(self, usage: ChatUsage) -> DomainResult<GatewayUsageRecordCommand> {
        let input_amount = self.input_unit_price.multiply_i64(usage.prompt_tokens)?;
        let output_amount = self
            .output_unit_price
            .multiply_i64(usage.completion_tokens)?;
        let upstream_input_amount = self
            .upstream_input_unit_price
            .multiply_i64(usage.prompt_tokens)?;
        let upstream_output_amount = self
            .upstream_output_unit_price
            .multiply_i64(usage.completion_tokens)?;
        Ok(GatewayUsageRecordCommand {
            request_id: self.request_id,
            trace_id: self.trace_id,
            tenant_id: self.tenant_id,
            organization_id: self.organization_id,
            user_id: self.user_id,
            api_key_id: self.api_key_id,
            api_key_name_snapshot: self.api_key_name_snapshot,
            api_key_group_id: self.api_key_group_id,
            api_key_group_snapshot: self.api_key_group_snapshot,
            catalog_key: self.catalog_key,
            requested_model: self.requested_model,
            provider_code: self.provider_code,
            channel_id: self.channel_id,
            provider_model: self.provider_model,
            request_path: self.request_path,
            http_method: self.http_method,
            http_status: self.http_status,
            streaming: self.streaming,
            prompt_tokens: usage.prompt_tokens,
            completion_tokens: usage.completion_tokens,
            cached_tokens: usage.cached_tokens,
            total_tokens: usage.total_tokens,
            base_input_unit_price: self.base_input_unit_price,
            base_output_unit_price: self.base_output_unit_price,
            customer_charge_amount: (input_amount + output_amount).to_fixed_string(6),
            upstream_cost_amount: (upstream_input_amount + upstream_output_amount)
                .to_fixed_string(6),
            currency: self.currency,
            pricing_plan_code: self.pricing_plan_code,
        })
    }
}

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
struct ChatUsage {
    prompt_tokens: i64,
    completion_tokens: i64,
    cached_tokens: i64,
    total_tokens: i64,
}

fn chat_usage_from_response(body: &Value) -> DomainResult<ChatUsage> {
    let usage = body
        .get("usage")
        .ok_or_else(|| DomainError::new("provider chat completion response is missing usage"))?;
    let prompt_tokens = required_integer_field(usage, "prompt_tokens")?;
    let completion_tokens = required_integer_field(usage, "completion_tokens")?;
    let cached_tokens = usage
        .get("prompt_tokens_details")
        .map(|details| optional_integer_field(details, "cached_tokens"))
        .transpose()?
        .unwrap_or(0);
    let total_tokens = required_integer_field(usage, "total_tokens")?;
    Ok(ChatUsage {
        prompt_tokens,
        completion_tokens,
        cached_tokens,
        total_tokens,
    })
}

fn chat_usage_from_stream_event(body: &Value) -> DomainResult<Option<ChatUsage>> {
    let Some(usage) = body.get("usage") else {
        return Ok(None);
    };
    if usage.is_null() {
        return Ok(None);
    }
    let prompt_tokens = required_integer_field(usage, "prompt_tokens")?;
    let completion_tokens = required_integer_field(usage, "completion_tokens")?;
    let cached_tokens = usage
        .get("prompt_tokens_details")
        .map(|details| optional_integer_field(details, "cached_tokens"))
        .transpose()?
        .unwrap_or(0);
    let total_tokens = required_integer_field(usage, "total_tokens")?;
    Ok(Some(ChatUsage {
        prompt_tokens,
        completion_tokens,
        cached_tokens,
        total_tokens,
    }))
}

fn required_integer_field(value: &Value, field: &str) -> DomainResult<i64> {
    let integer = value
        .get(field)
        .and_then(Value::as_i64)
        .ok_or_else(|| DomainError::new(format!("provider usage.{field} is required")))?;
    non_negative_integer(field, integer)
}

fn optional_integer_field(value: &Value, field: &str) -> DomainResult<i64> {
    let Some(integer) = value.get(field).and_then(Value::as_i64) else {
        return Ok(0);
    };
    non_negative_integer(field, integer)
}

fn non_negative_integer(field: &str, integer: i64) -> DomainResult<i64> {
    if integer < 0 {
        return Err(DomainError::new(format!(
            "provider usage.{field} must be non-negative"
        )));
    }
    Ok(integer)
}

fn build_usage_record_command<C>(
    catalog: &C,
    headers: &HeaderMap,
    uri: &Uri,
    context: &AuthenticatedApiKeyContext,
    route: &ModelProviderRoute,
    requested_model: &str,
    http_status: u16,
    streaming: bool,
    usage: ChatUsage,
) -> DomainResult<GatewayUsageRecordCommand>
where
    C: PricingCatalog + Send + Sync,
{
    build_usage_record_command_builder(
        catalog,
        headers,
        uri,
        context,
        route,
        requested_model,
        http_status,
        streaming,
    )?
    .build(usage)
}

fn build_usage_record_command_builder<C>(
    catalog: &C,
    headers: &HeaderMap,
    uri: &Uri,
    context: &AuthenticatedApiKeyContext,
    route: &ModelProviderRoute,
    requested_model: &str,
    http_status: u16,
    streaming: bool,
) -> DomainResult<GatewayUsageRecordCommandBuilder>
where
    C: PricingCatalog + Send + Sync,
{
    let input_price = PricingResolver::new(catalog).resolve(ResolveModelPriceQuery {
        api_key_id: context.api_key_id,
        model: route.catalog_key.clone(),
        billing_meter: BillingMeter::LlmInputToken,
        provider_code: Some(route.provider_code.clone()),
    })?;
    let output_price = PricingResolver::new(catalog).resolve(ResolveModelPriceQuery {
        api_key_id: context.api_key_id,
        model: route.catalog_key.clone(),
        billing_meter: BillingMeter::LlmOutputToken,
        provider_code: Some(route.provider_code.clone()),
    })?;
    let upstream_input_unit_price = input_price
        .upstream_cost
        .as_ref()
        .map(|price| price.unit_price.unit_price)
        .unwrap_or(DecimalValue::ZERO);
    let upstream_output_unit_price = output_price
        .upstream_cost
        .as_ref()
        .map(|price| price.unit_price.unit_price)
        .unwrap_or(DecimalValue::ZERO);

    Ok(GatewayUsageRecordCommandBuilder {
        request_id: header_value(headers, X_REQUEST_ID)
            .unwrap_or_else(|| generated_request_id(context.api_key_id)),
        trace_id: header_value(headers, X_TRACE_ID),
        tenant_id: context.tenant_id,
        organization_id: context.organization_id,
        user_id: context.user_id,
        api_key_id: context.api_key_id,
        api_key_name_snapshot: context.api_key_name_snapshot.clone(),
        api_key_group_id: context.group_id,
        api_key_group_snapshot: context.group_code.clone(),
        catalog_key: route.catalog_key.clone(),
        requested_model: requested_model.to_owned(),
        provider_code: route.provider_code.clone(),
        channel_id: route.channel_id,
        provider_model: route.provider_model.clone(),
        request_path: uri.path().to_owned(),
        http_method: "POST".to_owned(),
        http_status,
        streaming,
        base_input_unit_price: input_price.customer_charge.to_fixed_string(6),
        base_output_unit_price: output_price.customer_charge.to_fixed_string(6),
        input_unit_price: input_price.customer_charge.unit_price,
        output_unit_price: output_price.customer_charge.unit_price,
        upstream_input_unit_price,
        upstream_output_unit_price,
        currency: input_price.customer_charge.currency,
        pricing_plan_code: context.pricing_plan_code.clone(),
    })
}

fn header_value(headers: &HeaderMap, name: &str) -> Option<String> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
}

fn generated_request_id(api_key_id: i64) -> String {
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_nanos())
        .unwrap_or_default();
    format!("openai-chat-{api_key_id}-{nanos}")
}

struct StreamingUsageRecordingBody {
    inner: Body,
    usage_recorder: Option<Arc<dyn GatewayUsageRecorder + Send + Sync>>,
    command_builder: Option<GatewayUsageRecordCommandBuilder>,
    event_buffer: String,
    usage: Option<ChatUsage>,
    recording: Option<GatewayUsageRecordFuture<'static>>,
    terminal_error: Option<String>,
}

impl StreamingUsageRecordingBody {
    fn new(
        inner: Body,
        usage_recorder: Arc<dyn GatewayUsageRecorder + Send + Sync>,
        command_builder: GatewayUsageRecordCommandBuilder,
    ) -> Self {
        Self {
            inner,
            usage_recorder: Some(usage_recorder),
            command_builder: Some(command_builder),
            event_buffer: String::new(),
            usage: None,
            recording: None,
            terminal_error: None,
        }
    }

    fn observe_chunk(&mut self, chunk: &Bytes) {
        let text = String::from_utf8_lossy(chunk);
        self.event_buffer.push_str(&text);
        while let Some((boundary, boundary_len)) = next_sse_event_boundary(&self.event_buffer) {
            let event = self.event_buffer[..boundary].to_owned();
            self.event_buffer.drain(..boundary + boundary_len);
            self.observe_event(&event);
        }
    }

    fn observe_event(&mut self, event: &str) {
        let data = event
            .lines()
            .filter_map(|line| line.strip_prefix("data:"))
            .map(str::trim_start)
            .collect::<Vec<_>>()
            .join("\n");
        if data.is_empty() || data.trim() == "[DONE]" {
            return;
        }
        let Ok(payload) = serde_json::from_str::<Value>(&data) else {
            return;
        };
        match chat_usage_from_stream_event(&payload) {
            Ok(Some(usage)) => self.usage = Some(usage),
            Ok(None) => {}
            Err(error) => {
                tracing::warn!(error = %error, "failed to parse streaming chat usage event");
                self.terminal_error = Some(error.to_string());
            }
        }
    }

    fn prepare_recording(&mut self) {
        if self.recording.is_some() || self.terminal_error.is_some() {
            return;
        }
        let Some(usage_recorder) = self.usage_recorder.take() else {
            return;
        };
        let Some(command_builder) = self.command_builder.take() else {
            return;
        };
        let Some(usage) = self.usage else {
            let error = "provider streaming chat completion response is missing usage".to_owned();
            tracing::warn!(error);
            self.terminal_error = Some(error);
            return;
        };
        let command = match command_builder.build(usage) {
            Ok(command) => command,
            Err(error) => {
                tracing::warn!(error = %error, "failed to build streaming chat usage record");
                self.terminal_error = Some(error.to_string());
                return;
            }
        };
        let future: GatewayUsageRecordFuture<'static> =
            Box::pin(async move { usage_recorder.record_gateway_usage(command).await });
        self.recording = Some(future);
    }

    fn poll_recording(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), axum::Error>> {
        self.prepare_recording();
        if let Some(error) = self.terminal_error.take() {
            return Poll::Ready(Err(axum::Error::new(std::io::Error::new(
                std::io::ErrorKind::Other,
                error,
            ))));
        }
        let Some(recording) = self.recording.as_mut() else {
            return Poll::Ready(Ok(()));
        };
        match recording.as_mut().poll(cx) {
            Poll::Ready(Ok(())) => {
                self.recording = None;
                Poll::Ready(Ok(()))
            }
            Poll::Ready(Err(error)) => {
                tracing::warn!(error = %error, "failed to record streaming chat usage");
                self.recording = None;
                Poll::Ready(Err(axum::Error::new(std::io::Error::new(
                    std::io::ErrorKind::Other,
                    error.to_string(),
                ))))
            }
            Poll::Pending => Poll::Pending,
        }
    }
}

fn next_sse_event_boundary(buffer: &str) -> Option<(usize, usize)> {
    [("\r\n\r\n", 4_usize), ("\n\n", 2_usize), ("\r\r", 2_usize)]
        .into_iter()
        .filter_map(|(needle, len)| buffer.find(needle).map(|index| (index, len)))
        .min_by_key(|(index, _)| *index)
}

impl HttpBody for StreamingUsageRecordingBody {
    type Data = Bytes;
    type Error = axum::Error;

    fn poll_frame(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
    ) -> Poll<Option<Result<Frame<Self::Data>, Self::Error>>> {
        match Pin::new(&mut self.inner).poll_frame(cx) {
            Poll::Ready(Some(Ok(frame))) => {
                if let Some(data) = frame.data_ref() {
                    self.observe_chunk(data);
                }
                Poll::Ready(Some(Ok(frame)))
            }
            Poll::Ready(None) => match self.poll_recording(cx) {
                Poll::Ready(Ok(())) => Poll::Ready(None),
                Poll::Ready(Err(error)) => Poll::Ready(Some(Err(error))),
                Poll::Pending => Poll::Pending,
            },
            other => other,
        }
    }
}
