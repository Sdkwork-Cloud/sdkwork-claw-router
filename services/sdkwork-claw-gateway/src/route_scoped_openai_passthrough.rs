use crate::gateway_api_key_auth::authenticate_gateway_api_key;
use crate::openai_passthrough_payload;
use crate::openai_passthrough_routes::{
    apply_openai_passthrough_routes, apply_stored_chat_completion_passthrough_routes,
};
use crate::openai_route_taxonomy::classify_openai_route;
use crate::provider_account_auth::render_provider_account_auth;
use crate::provider_passthrough_transport::{
    build_provider_passthrough_client, forward_provider_passthrough_to_target, PassthroughClient,
    ProviderPassthroughTarget,
};
use crate::request_identity::generate_server_request_id;
use axum::body::{to_bytes, Body};
use axum::extract::{Request, State};
use axum::http::request::Parts as RequestParts;
use axum::http::{header::USER_AGENT, HeaderMap, Method, StatusCode, Uri};
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, MethodRouter};
use axum::{Json, Router};
use http_body_util::BodyExt;
#[cfg(test)]
use sdkwork_claw_config::ProviderPassthroughAuth;
use sdkwork_claw_product::api::{
    normalize_user_agent_header, OpenAiInvocationContext, OpenAiInvocationEndpoint,
    OpenAiInvocationRelayOutcome, OpenAiProviderRoute, OpenAiUsageRecorder,
};
use sdkwork_claw_product::application::{
    ApiKeySecretHasher, AuthenticatedApiKeyContext, PricingResolver, ProviderRouteSelectionError,
    ProviderRouteSelectionErrorKind, ProviderRouteSelector, ResolveModelPriceQuery,
    SelectProviderChannelRouteQuery, SelectProviderRouteQuery, SelectedProviderRoute,
};
use sdkwork_claw_product::domain::{
    provider_native_model_id, AiModel, BillingMeter, DecimalValue, DomainError, DomainResult,
    ProviderAuthProfile, ProviderChannelRoute, RoutingCapability,
};
use sdkwork_claw_product::ports::{
    GatewayUsageQuantity, GatewayUsageRecordCommand, GatewayUsageRecorder, PricingCatalog,
    ProviderSecretResolver,
};
use serde_json::{json, Value};
use std::sync::Arc;
use std::time::Instant;

type UsageRecorder = Arc<dyn GatewayUsageRecorder + Send + Sync>;

const MAX_ROUTE_SCOPED_USAGE_RESPONSE_BODY_BYTES: usize = 16 * 1024 * 1024;
const ROUTE_SCOPED_USAGE_TYPE_BASE: i64 = 20_000;
const TOKEN_BILLING_UNIT_SIZE_DECIMAL: &str = "1000000";
const USAGE_AMOUNT_DECIMAL_DIGITS: u32 = 12;
const MODALITY_IMAGE: i64 = 2;

#[derive(Clone)]
struct RouteScopedOpenAiPassthroughRuntime {
    client: PassthroughClient,
    secret_resolver: Arc<dyn ProviderSecretResolver + Send + Sync>,
}

struct RouteScopedOpenAiPassthroughState<C> {
    runtime: RouteScopedOpenAiPassthroughRuntime,
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    usage_recorder: Option<UsageRecorder>,
}

impl<C> Clone for RouteScopedOpenAiPassthroughState<C> {
    fn clone(&self) -> Self {
        Self {
            runtime: self.runtime.clone(),
            catalog: Arc::clone(&self.catalog),
            api_key_hasher: Arc::clone(&self.api_key_hasher),
            usage_recorder: self.usage_recorder.clone(),
        }
    }
}

pub(crate) fn router<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    secret_resolver: Arc<dyn ProviderSecretResolver + Send + Sync>,
    usage_recorder: Option<UsageRecorder>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let state = RouteScopedOpenAiPassthroughState {
        runtime: RouteScopedOpenAiPassthroughRuntime::new(secret_resolver),
        catalog,
        api_key_hasher,
        usage_recorder,
    };
    router_with_state(state)
}

fn router_with_state<C>(state: RouteScopedOpenAiPassthroughState<C>) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let router = apply_openai_passthrough_routes(
        Router::new(),
        MethodRouter::new().fallback(forward_openai_passthrough::<C>),
    )
    .route(
        "/v1/models/{model}",
        delete(forward_openai_passthrough::<C>),
    );
    apply_stored_chat_completion_passthrough_routes(
        router,
        MethodRouter::new().fallback(forward_openai_passthrough::<C>),
    )
    .with_state(state)
}

async fn forward_openai_passthrough<C>(
    State(state): State<RouteScopedOpenAiPassthroughState<C>>,
    headers: HeaderMap,
    uri: Uri,
    request: Request,
) -> Response
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let context = match authenticate_api_key(&state, &headers, &uri) {
        Ok(context) => context,
        Err(response) => return response,
    };
    match state
        .runtime
        .forward_openai(
            Arc::clone(&state.catalog),
            state.usage_recorder.clone(),
            context,
            request,
        )
        .await
    {
        Ok(response) => response,
        Err(error) => error.into_response(),
    }
}

fn authenticate_api_key<C>(
    state: &RouteScopedOpenAiPassthroughState<C>,
    headers: &HeaderMap,
    uri: &Uri,
) -> Result<AuthenticatedApiKeyContext, Response>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    authenticate_gateway_api_key(
        state.catalog.as_ref(),
        state.api_key_hasher.as_ref(),
        headers,
        uri,
    )
}

#[derive(Debug)]
struct RouteScopedOpenAiPassthroughIntent {
    requested_model: Option<String>,
    requested_model_source: Option<openai_passthrough_payload::OpenAiPassthroughModelSource>,
    route_key: String,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    routes_model_when_present: bool,
}

#[derive(Debug, Clone)]
struct RouteScopedMeteredUsageContext {
    api_key_context: AuthenticatedApiKeyContext,
    request_id: Option<String>,
    trace_id: Option<String>,
    requested_model: String,
    request_body: Value,
    request_path: String,
    http_method: String,
    user_agent: Option<String>,
    billing_meter: BillingMeter,
}

#[derive(Debug)]
struct RouteScopedOpenAiPassthroughError {
    status: StatusCode,
    code: &'static str,
    error_type: &'static str,
    message: String,
}

impl RouteScopedOpenAiPassthroughError {
    fn invalid_request(message: impl ToString) -> Self {
        Self {
            status: StatusCode::BAD_REQUEST,
            code: "invalid_request",
            error_type: "invalid_request_error",
            message: message.to_string(),
        }
    }

    fn model_not_found(model: &str) -> Self {
        Self {
            status: StatusCode::NOT_FOUND,
            code: "model_not_found",
            error_type: "invalid_request_error",
            message: format!("model is not available: {model}"),
        }
    }

    fn ambiguous_model(model: &str, matches: &[AiModel]) -> Self {
        Self {
            status: StatusCode::BAD_REQUEST,
            code: "ambiguous_model",
            error_type: "invalid_request_error",
            message: format!(
                "model id is ambiguous: {model}. Use one of these catalog keys: {}",
                matches
                    .iter()
                    .map(|candidate| candidate.catalog_key.as_str())
                    .collect::<Vec<_>>()
                    .join(", ")
            ),
        }
    }

    fn provider_route_unavailable(message: impl ToString) -> Self {
        Self {
            status: StatusCode::SERVICE_UNAVAILABLE,
            code: "provider_route_not_available",
            error_type: "server_error",
            message: message.to_string(),
        }
    }

    fn pricing_unavailable(message: impl ToString) -> Self {
        Self {
            status: StatusCode::BAD_REQUEST,
            code: "pricing_unavailable",
            error_type: "invalid_request_error",
            message: message.to_string(),
        }
    }

    fn relay_failed(message: impl ToString) -> Self {
        Self {
            status: StatusCode::BAD_GATEWAY,
            code: "openai_passthrough_relay_failed",
            error_type: "server_error",
            message: message.to_string(),
        }
    }

    fn usage_record_failed(message: impl ToString) -> Self {
        Self {
            status: StatusCode::BAD_GATEWAY,
            code: "provider_usage_record_failed",
            error_type: "server_error",
            message: message.to_string(),
        }
    }

    fn into_response(self) -> Response {
        (
            self.status,
            Json(json!({
                "error": {
                    "message": self.message,
                    "type": self.error_type,
                    "param": null,
                    "code": self.code
                }
            })),
        )
            .into_response()
    }
}

impl From<ProviderRouteSelectionError> for RouteScopedOpenAiPassthroughError {
    fn from(value: ProviderRouteSelectionError) -> Self {
        let message = value.to_string();
        match value.kind() {
            ProviderRouteSelectionErrorKind::ProviderRouteUnavailable => {
                Self::provider_route_unavailable(message)
            }
            ProviderRouteSelectionErrorKind::PricingUnavailable => {
                Self::pricing_unavailable(message)
            }
        }
    }
}

impl RouteScopedOpenAiPassthroughRuntime {
    fn new(secret_resolver: Arc<dyn ProviderSecretResolver + Send + Sync>) -> Self {
        Self {
            client: build_provider_passthrough_client(),
            secret_resolver,
        }
    }

    async fn forward_openai<C>(
        &self,
        catalog: Arc<C>,
        usage_recorder: Option<UsageRecorder>,
        context: AuthenticatedApiKeyContext,
        request: Request,
    ) -> Result<Response, RouteScopedOpenAiPassthroughError>
    where
        C: PricingCatalog + Send + Sync + 'static,
    {
        let (parts, body) = request.into_parts();
        let body = body
            .collect()
            .await
            .map_err(|error| {
                RouteScopedOpenAiPassthroughError::relay_failed(format!(
                    "failed to read OpenAI-compatible passthrough body: {error}"
                ))
            })?
            .to_bytes();
        let intent = route_scoped_openai_passthrough_intent(&parts, &body)?;
        let route = select_route_scoped_openai_passthrough_target(
            catalog.as_ref(),
            context.clone(),
            &intent,
        )?;
        let token_usage_context =
            build_route_scoped_openai_usage_context(&parts, &body, &context, &intent)?;
        let metered_usage_context =
            build_route_scoped_metered_usage_context(&parts, &body, &context, &intent)?;
        let usage_route = route.usage_route.clone();
        let base_url = route.base_url.ok_or_else(|| {
            RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                "provider route is not available for configured channel route: selected channel {} has no base URL",
                route.channel_id
            ))
        })?;
        let secret_ref = route.secret_ref.ok_or_else(|| {
            RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                "provider route is not available for configured channel route: selected channel {} has no secret_ref",
                route.channel_id
            ))
        })?;
        let secret_value = self
            .secret_resolver
            .resolve_secret_value(&secret_ref)
            .map_err(|error| {
                RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                    "provider route is not available for configured channel route: {error}"
                ))
            })?;
        let rendered_auth = render_provider_account_auth(&route.auth_profile, secret_value)
            .map_err(RouteScopedOpenAiPassthroughError::relay_failed)?;
        let target = ProviderPassthroughTarget::new(
            route.provider_code,
            base_url.trim_end_matches('/').to_owned(),
            rendered_auth.auth,
            rendered_auth.default_headers,
        );
        let upstream_uri = build_route_scoped_openai_passthrough_uri(
            &target,
            &parts.uri,
            route.provider_model.as_deref(),
            intent.requested_model_source,
        )
        .map_err(RouteScopedOpenAiPassthroughError::relay_failed)?;
        let body = match route.provider_model.as_deref() {
            Some(provider_model) => openai_passthrough_payload::rewrite_body(
                &parts.method,
                &parts.uri,
                &parts.headers,
                body,
                provider_model,
            )
            .map_err(RouteScopedOpenAiPassthroughError::invalid_request)?,
            None => body,
        };
        let started_at = Instant::now();
        let response = forward_provider_passthrough_to_target(
            &self.client,
            parts,
            body,
            &target,
            upstream_uri,
        )
        .await
        .map_err(RouteScopedOpenAiPassthroughError::relay_failed)?;
        let latency_ms = i64::try_from(started_at.elapsed().as_millis()).unwrap_or(i64::MAX);
        record_route_scoped_openai_usage_if_needed(
            catalog,
            usage_recorder,
            token_usage_context,
            metered_usage_context,
            usage_route,
            response,
            latency_ms,
        )
        .await
    }
}

fn build_route_scoped_openai_usage_context(
    parts: &RequestParts,
    body: &[u8],
    context: &AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
) -> Result<Option<OpenAiInvocationContext>, RouteScopedOpenAiPassthroughError> {
    let Some(endpoint) = route_scoped_openai_usage_endpoint(&parts.method, parts.uri.path()) else {
        return Ok(None);
    };
    let request_body = serde_json::from_slice::<Value>(body).map_err(|error| {
        RouteScopedOpenAiPassthroughError::invalid_request(format!(
            "invalid request body for route-scoped OpenAI usage recording: {error}"
        ))
    })?;
    let stream = request_body
        .get("stream")
        .and_then(Value::as_bool)
        .unwrap_or(false);
    if stream {
        return Ok(None);
    }
    let requested_model = intent.requested_model.clone().ok_or_else(|| {
        RouteScopedOpenAiPassthroughError::invalid_request(
            "model is required for route-scoped OpenAI usage recording",
        )
    })?;
    Ok(Some(OpenAiInvocationContext::new(
        endpoint,
        context.clone(),
        requested_model,
        stream,
        request_body,
        &parts.headers,
        &parts.uri,
    )))
}

fn route_scoped_openai_usage_endpoint(
    method: &Method,
    path: &str,
) -> Option<OpenAiInvocationEndpoint> {
    if method == Method::POST && path == "/v1/completions" {
        return Some(OpenAiInvocationEndpoint::ChatCompletions);
    }
    None
}

fn build_route_scoped_metered_usage_context(
    parts: &RequestParts,
    body: &[u8],
    api_key_context: &AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
) -> Result<Option<RouteScopedMeteredUsageContext>, RouteScopedOpenAiPassthroughError> {
    let Some(billing_meter) = route_scoped_metered_usage_meter(&parts.method, parts.uri.path())
    else {
        return Ok(None);
    };
    let request_body = serde_json::from_slice::<Value>(body).map_err(|error| {
        RouteScopedOpenAiPassthroughError::invalid_request(format!(
            "invalid request body for route-scoped metered usage recording: {error}"
        ))
    })?;
    let requested_model = intent.requested_model.clone().ok_or_else(|| {
        RouteScopedOpenAiPassthroughError::invalid_request(
            "model is required for route-scoped metered usage recording",
        )
    })?;
    Ok(Some(RouteScopedMeteredUsageContext {
        api_key_context: api_key_context.clone(),
        request_id: Some(generate_server_request_id()),
        trace_id: header_value(&parts.headers, "x-trace-id"),
        requested_model,
        request_body,
        request_path: parts.uri.path().to_owned(),
        http_method: parts.method.to_string(),
        user_agent: header_value(&parts.headers, USER_AGENT.as_str())
            .and_then(|value| normalize_user_agent_header(value.as_str())),
        billing_meter,
    }))
}

fn route_scoped_metered_usage_meter(method: &Method, path: &str) -> Option<BillingMeter> {
    if method == Method::POST && path == "/v1/images/generations" {
        return Some(BillingMeter::ImageResult);
    }
    None
}

async fn record_route_scoped_openai_usage_if_needed<C>(
    catalog: Arc<C>,
    usage_recorder: Option<UsageRecorder>,
    usage_context: Option<OpenAiInvocationContext>,
    metered_usage_context: Option<RouteScopedMeteredUsageContext>,
    usage_route: Option<OpenAiProviderRoute>,
    response: Response,
    latency_ms: i64,
) -> Result<Response, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let Some(usage_recorder) = usage_recorder else {
        return Ok(response);
    };
    if usage_context.is_none() && metered_usage_context.is_none() {
        return Ok(response);
    }
    let status_code = response.status().as_u16();
    if !(200..=299).contains(&status_code) {
        return Ok(response);
    }
    let usage_route = usage_route.ok_or_else(|| {
        RouteScopedOpenAiPassthroughError::usage_record_failed(
            "route-scoped OpenAI usage recording requires a selected model provider route",
        )
    })?;
    let (parts, body) = response.into_parts();
    let body = to_bytes(body, MAX_ROUTE_SCOPED_USAGE_RESPONSE_BODY_BYTES)
        .await
        .map_err(|error| {
            RouteScopedOpenAiPassthroughError::usage_record_failed(format!(
                "failed to read route-scoped OpenAI response body for usage recording: {error}"
            ))
        })?;
    let response_body = serde_json::from_slice::<Value>(&body).map_err(|error| {
        RouteScopedOpenAiPassthroughError::usage_record_failed(format!(
            "route-scoped OpenAI response body is not valid JSON for usage recording: {error}"
        ))
    })?;
    if let Some(usage_context) = usage_context {
        let outcome = OpenAiInvocationRelayOutcome::json(status_code, response_body.clone())
            .with_latency_ms(latency_ms);
        OpenAiUsageRecorder::new(Arc::clone(&catalog), Arc::clone(&usage_recorder))
            .record_after_relay(&usage_context, &usage_route, &outcome)
            .await
            .map_err(|error| {
                RouteScopedOpenAiPassthroughError::usage_record_failed(error.message)
            })?;
    }
    if let Some(metered_usage_context) = metered_usage_context {
        let command = route_scoped_metered_usage_command(
            catalog.as_ref(),
            &metered_usage_context,
            &usage_route,
            &response_body,
            status_code,
            latency_ms,
        )
        .map_err(|error| {
            RouteScopedOpenAiPassthroughError::usage_record_failed(error.to_string())
        })?;
        usage_recorder
            .record_gateway_usage(command)
            .await
            .map_err(|error| {
                RouteScopedOpenAiPassthroughError::usage_record_failed(error.to_string())
            })?;
    }
    Ok(Response::from_parts(parts, Body::from(body)))
}

fn route_scoped_metered_usage_command<C>(
    catalog: &C,
    context: &RouteScopedMeteredUsageContext,
    route: &OpenAiProviderRoute,
    response_body: &Value,
    status_code: u16,
    latency_ms: i64,
) -> DomainResult<GatewayUsageRecordCommand>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let quantity = route_scoped_metered_usage_quantity(context, response_body)?;
    let price = PricingResolver::new(catalog).resolve(ResolveModelPriceQuery {
        api_key_id: context.api_key_context.api_key_id,
        model: route.catalog_key.clone(),
        billing_meter: context.billing_meter.clone(),
        provider_code: Some(route.provider_code.clone()),
        channel_id: Some(route.channel_id),
    })?;
    let official_reference_amount = route_scoped_meter_amount(
        price.official_reference.unit_price.unit_price,
        quantity.billable_quantity.as_str(),
        &context.billing_meter,
    )?;
    let upstream_cost_amount = match price.upstream_cost.as_ref() {
        Some(upstream) => route_scoped_meter_amount(
            upstream.unit_price.unit_price,
            quantity.billable_quantity.as_str(),
            &context.billing_meter,
        )?,
        None => DecimalValue::ZERO,
    };
    let customer_charge_amount = route_scoped_meter_amount(
        price.customer_charge.unit_price,
        quantity.billable_quantity.as_str(),
        &context.billing_meter,
    )?;
    let provider_native_model = provider_native_model_id(&route.provider_model);
    let pricing_snapshot = route_scoped_metered_pricing_snapshot(
        context,
        route,
        &provider_native_model,
        &price,
        quantity.billable_quantity.as_str(),
    );

    Ok(GatewayUsageRecordCommand {
        request_id: context
            .request_id
            .clone()
            .unwrap_or_else(generate_server_request_id),
        trace_id: context.trace_id.clone(),
        tenant_id: context.api_key_context.tenant_id,
        organization_id: context.api_key_context.organization_id,
        user_id: context.api_key_context.user_id,
        api_key_id: context.api_key_context.api_key_id,
        api_key_name_snapshot: context.api_key_context.api_key_name_snapshot.clone(),
        channel_group_id: context.api_key_context.group_id,
        channel_group_snapshot: context.api_key_context.group_code.clone(),
        catalog_key: route.catalog_key.clone(),
        requested_model: context.requested_model.clone(),
        requested_model_catalog_key: route.catalog_key.clone(),
        provider_code: route.provider_code.clone(),
        channel_id: route.channel_id,
        provider_model: provider_native_model.clone(),
        provider_native_model,
        request_path: context.request_path.clone(),
        http_method: context.http_method.clone(),
        user_agent: context.user_agent.clone(),
        http_status: status_code,
        streaming: false,
        modality: route_scoped_modality_for_meter(&context.billing_meter),
        usage_type: route_scoped_usage_type_for_meter(&context.billing_meter),
        billing_meter_code: context.billing_meter.code().to_owned(),
        billable_quantity: quantity.billable_quantity,
        prompt_tokens: 0,
        completion_tokens: 0,
        cached_tokens: 0,
        total_tokens: 0,
        request_count: quantity.request_count,
        result_count: quantity.result_count,
        item_count: quantity.item_count,
        character_count: quantity.character_count,
        image_count: quantity.image_count,
        audio_seconds: quantity.audio_seconds,
        video_seconds: quantity.video_seconds,
        latency_ms: Some(latency_ms.max(0)),
        ttft_ms: None,
        provider_error_code: None,
        error_type: None,
        error_message_masked: None,
        base_input_unit_price: price.customer_charge_before_rate.to_fixed_string(6),
        base_output_unit_price: "0.000000".to_owned(),
        cache_read_unit_price: "0.000000".to_owned(),
        rate_multiplier: price.rate_multiplier.to_fixed_string(6),
        reference_multiplier: price.reference_multiplier.to_fixed_string(6),
        official_reference_amount: official_reference_amount
            .to_fixed_string(USAGE_AMOUNT_DECIMAL_DIGITS),
        customer_charge_amount: customer_charge_amount.to_fixed_string(USAGE_AMOUNT_DECIMAL_DIGITS),
        upstream_cost_amount: upstream_cost_amount.to_fixed_string(USAGE_AMOUNT_DECIMAL_DIGITS),
        currency: price.customer_charge.currency,
        pricing_plan_code: price.pricing_plan_code,
        pricing_snapshot,
    })
}

fn route_scoped_metered_usage_quantity(
    context: &RouteScopedMeteredUsageContext,
    response_body: &Value,
) -> DomainResult<GatewayUsageQuantity> {
    match &context.billing_meter {
        BillingMeter::ImageResult => {
            let count = response_body
                .get("data")
                .and_then(Value::as_array)
                .map(|items| items.len() as i64)
                .or_else(|| {
                    context
                        .request_body
                        .get("n")
                        .and_then(Value::as_i64)
                        .filter(|value| *value > 0)
                })
                .unwrap_or(1);
            GatewayUsageQuantity::for_meter(BillingMeter::ImageResult, count.to_string())
        }
        _ => Err(DomainError::new(format!(
            "route-scoped OpenAI metered usage does not support meter {}",
            context.billing_meter.code()
        ))),
    }
}

fn route_scoped_meter_amount(
    unit_price: DecimalValue,
    billable_quantity: &str,
    billing_meter: &BillingMeter,
) -> DomainResult<DecimalValue> {
    let amount = unit_price.checked_multiply(DecimalValue::parse(billable_quantity)?)?;
    if route_scoped_meter_uses_million_token_unit(billing_meter) {
        amount.checked_divide(DecimalValue::parse(TOKEN_BILLING_UNIT_SIZE_DECIMAL)?)
    } else {
        Ok(amount)
    }
}

fn route_scoped_meter_uses_million_token_unit(billing_meter: &BillingMeter) -> bool {
    matches!(
        billing_meter,
        BillingMeter::LlmInputToken
            | BillingMeter::LlmOutputToken
            | BillingMeter::LlmReasoningToken
            | BillingMeter::LlmCacheWriteToken
            | BillingMeter::LlmCacheReadToken
            | BillingMeter::EmbeddingInputToken
            | BillingMeter::AudioInputToken
            | BillingMeter::AudioOutputToken
            | BillingMeter::ImageInputToken
            | BillingMeter::ImageOutputToken
            | BillingMeter::VideoInputToken
            | BillingMeter::VideoOutputToken
    )
}

fn route_scoped_modality_for_meter(billing_meter: &BillingMeter) -> i64 {
    match billing_meter {
        BillingMeter::ImageInputToken
        | BillingMeter::ImageOutputToken
        | BillingMeter::ImageResult
        | BillingMeter::ImagePixel
        | BillingMeter::ImageMegapixel => MODALITY_IMAGE,
        _ => 1,
    }
}

fn route_scoped_usage_type_for_meter(billing_meter: &BillingMeter) -> i64 {
    ROUTE_SCOPED_USAGE_TYPE_BASE
        + match billing_meter {
            BillingMeter::ImageResult => 11,
            _ => 99,
        }
}

fn route_scoped_metered_pricing_snapshot(
    context: &RouteScopedMeteredUsageContext,
    route: &OpenAiProviderRoute,
    provider_native_model: &str,
    price: &sdkwork_claw_product::application::ResolvedModelPrice,
    billable_quantity: &str,
) -> String {
    json!({
        "source": "route_scoped_openai_passthrough",
        "meter": {
            "code": context.billing_meter.code(),
            "billableQuantity": billable_quantity
        },
        "model": {
            "catalogKey": route.catalog_key.as_str(),
            "requestedCatalogKey": route.catalog_key.as_str(),
            "model": context.requested_model.as_str(),
            "providerNativeModel": provider_native_model
        },
        "provider": {
            "code": route.provider_code.as_str(),
            "channelId": route.channel_id
        },
        "pricingPlan": {
            "code": price.pricing_plan_code.as_str()
        },
        "group": {
            "code": price.group_code.as_str()
        },
        "multipliers": {
            "rate": price.rate_multiplier.to_fixed_string(6),
            "reference": price.reference_multiplier.to_fixed_string(6)
        }
    })
    .to_string()
}

fn header_value(headers: &HeaderMap, name: &str) -> Option<String> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
}

fn build_route_scoped_openai_passthrough_uri(
    target: &ProviderPassthroughTarget,
    original_uri: &Uri,
    provider_model: Option<&str>,
    model_source: Option<openai_passthrough_payload::OpenAiPassthroughModelSource>,
) -> Result<Uri, String> {
    let path = if matches!(
        model_source,
        Some(openai_passthrough_payload::OpenAiPassthroughModelSource::Path)
    ) {
        let provider_model = provider_model.ok_or_else(|| {
            "provider model is required for OpenAI model path passthrough".to_owned()
        })?;
        format!(
            "/v1/models/{}",
            openai_passthrough_payload::percent_encode_path_segment(provider_model)
        )
    } else {
        original_uri.path().to_owned()
    };
    let path = target.normalize_openai_compatible_path(&path);
    let path_and_query = match original_uri.query() {
        Some(query)
            if matches!(
                model_source,
                Some(openai_passthrough_payload::OpenAiPassthroughModelSource::Query)
            ) =>
        {
            match provider_model {
                Some(provider_model) => format!(
                    "{path}?{}",
                    openai_passthrough_payload::rewrite_url_encoded_model(query, provider_model)
                ),
                None => format!("{path}?{query}"),
            }
        }
        Some(query) => format!("{path}?{query}"),
        None => path,
    };
    target
        .build_uri(path_and_query)
        .map_err(|error| format!("invalid OpenAI-compatible passthrough upstream URI: {error}"))
}

fn route_scoped_openai_passthrough_intent(
    parts: &RequestParts,
    body: &[u8],
) -> Result<RouteScopedOpenAiPassthroughIntent, RouteScopedOpenAiPassthroughError> {
    let path = parts.uri.path();
    let classification = classify_openai_route(&parts.method, path);
    let routes_model_when_present = classification.routes_model_when_present();
    let requested_model = if routes_model_when_present {
        openai_passthrough_payload::optional_requested_model_with_source(
            &parts.method,
            &parts.uri,
            &parts.headers,
            body,
        )
        .map_err(RouteScopedOpenAiPassthroughError::invalid_request)?
    } else {
        None
    };
    if requested_model.is_none() && !classification.permits_missing_model() {
        return Err(RouteScopedOpenAiPassthroughError::invalid_request(
            "model is required for OpenAI-compatible route-scoped passthrough",
        ));
    }
    Ok(RouteScopedOpenAiPassthroughIntent {
        requested_model: requested_model
            .as_ref()
            .map(|requested_model| requested_model.model().to_owned()),
        requested_model_source: requested_model
            .as_ref()
            .map(openai_passthrough_payload::OpenAiPassthroughRequestedModel::source),
        route_key: classification.route_key.to_owned(),
        capability: classification.capability,
        billing_meter: classification.billing_meter,
        routes_model_when_present,
    })
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct RouteScopedOpenAiPassthroughTarget {
    provider_code: String,
    channel_id: i64,
    provider_model: Option<String>,
    base_url: Option<String>,
    secret_ref: Option<String>,
    auth_profile: ProviderAuthProfile,
    usage_route: Option<OpenAiProviderRoute>,
}

fn select_route_scoped_openai_passthrough_target<C>(
    catalog: &C,
    context: AuthenticatedApiKeyContext,
    intent: &RouteScopedOpenAiPassthroughIntent,
) -> Result<RouteScopedOpenAiPassthroughTarget, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    match (
        intent.routes_model_when_present,
        intent.requested_model.as_deref(),
    ) {
        (true, Some(requested_model)) => {
            let catalog_model = find_catalog_model_for_passthrough(catalog, requested_model)?;
            let selection =
                ProviderRouteSelector::new(catalog).select(SelectProviderRouteQuery {
                    context,
                    catalog_key: catalog_model.catalog_key.clone(),
                    requested_model: requested_model.to_owned(),
                    capability: intent.capability,
                    billing_meter: intent.billing_meter.clone(),
                })?;
            Ok(model_route_to_passthrough_target(selection))
        }
        _ => {
            let selection = ProviderRouteSelector::new(catalog).select_channel_route(
                SelectProviderChannelRouteQuery {
                    context,
                    route_key: intent.route_key.clone(),
                    capability: intent.capability,
                },
            )?;
            Ok(channel_route_to_passthrough_target(selection.route))
        }
    }
}

fn model_route_to_passthrough_target(
    selection: SelectedProviderRoute,
) -> RouteScopedOpenAiPassthroughTarget {
    let route = selection.route;
    let usage_route = OpenAiProviderRoute {
        catalog_key: route.catalog_key.clone(),
        policy_id: selection.policy_id,
        rule_id: selection.rule_id,
        provider_code: route.provider_code.clone(),
        channel_id: route.channel_id,
        provider_model: route.provider_model.clone(),
        provider_base_url: route.base_url.clone(),
        provider_secret_ref: route.secret_ref.clone(),
        provider_auth_profile: route.auth_profile.clone(),
        provider_timeout_ms: route.timeout_ms,
        provider_retry_policy: route.retry_policy.clone(),
    };
    RouteScopedOpenAiPassthroughTarget {
        provider_code: route.provider_code,
        channel_id: route.channel_id,
        provider_model: Some(route.provider_model),
        base_url: route.base_url,
        secret_ref: route.secret_ref,
        auth_profile: route.auth_profile,
        usage_route: Some(usage_route),
    }
}

fn channel_route_to_passthrough_target(
    route: ProviderChannelRoute,
) -> RouteScopedOpenAiPassthroughTarget {
    RouteScopedOpenAiPassthroughTarget {
        provider_code: route.provider_code,
        channel_id: route.channel_id,
        provider_model: None,
        base_url: route.base_url,
        secret_ref: route.secret_ref,
        auth_profile: route.auth_profile,
        usage_route: None,
    }
}

fn find_catalog_model_for_passthrough<C>(
    catalog: &C,
    model: &str,
) -> Result<AiModel, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let model = model.trim();
    if let Some(catalog_model) = catalog.find_model(model) {
        return Ok(catalog_model);
    }

    let matches = catalog
        .list_models(None)
        .into_iter()
        .filter(|candidate| candidate.model == model)
        .collect::<Vec<_>>();
    match matches.as_slice() {
        [] => Err(RouteScopedOpenAiPassthroughError::model_not_found(model)),
        [model] => Ok(model.clone()),
        _ => Err(RouteScopedOpenAiPassthroughError::ambiguous_model(
            model, &matches,
        )),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use sdkwork_claw_product::infrastructure::InMemoryPricingCatalog;

    #[test]
    fn passthrough_catalog_lookup_accepts_native_slash_model_ids() {
        let mut catalog = InMemoryPricingCatalog::default();
        catalog.add_model(
            AiModel::new(
                "anthropic/claude-3-opus",
                "Claude 3 Opus via OpenRouter",
                "openrouter",
                vec!["chat"],
            )
            .with_catalog_key("openrouter/global/anthropic/claude-3-opus"),
        );

        let model = find_catalog_model_for_passthrough(&catalog, "anthropic/claude-3-opus")
            .expect("native slash model should resolve through AiModel.model");

        assert_eq!(
            "openrouter/global/anthropic/claude-3-opus",
            model.catalog_key
        );
        assert_eq!("anthropic/claude-3-opus", model.model);
    }

    #[test]
    fn route_scoped_uri_preserves_query_model_when_selected_model_came_from_body() {
        let target = ProviderPassthroughTarget::new(
            "openrouter",
            "https://upstream.example/v1".to_owned(),
            ProviderPassthroughAuth::bearer("sk-upstream").unwrap(),
            Vec::new(),
        );

        let uri = build_route_scoped_openai_passthrough_uri(
            &target,
            &"/v1/responses?model=query-filter&include=usage"
                .parse()
                .unwrap(),
            Some("openrouter/gpt-4o-mini"),
            Some(openai_passthrough_payload::OpenAiPassthroughModelSource::Body),
        )
        .unwrap();

        assert_eq!(
            "https://upstream.example/v1/responses?model=query-filter&include=usage",
            uri.to_string()
        );
    }

    #[test]
    fn route_scoped_uri_rewrites_query_model_when_selected_model_came_from_query() {
        let target = ProviderPassthroughTarget::new(
            "openrouter",
            "https://upstream.example/v1".to_owned(),
            ProviderPassthroughAuth::bearer("sk-upstream").unwrap(),
            Vec::new(),
        );

        let uri = build_route_scoped_openai_passthrough_uri(
            &target,
            &"/v1/responses/input_tokens?model=gpt-4o-mini&include=usage"
                .parse()
                .unwrap(),
            Some("openrouter/gpt-4o-mini"),
            Some(openai_passthrough_payload::OpenAiPassthroughModelSource::Query),
        )
        .unwrap();

        assert_eq!(
            "https://upstream.example/v1/responses/input_tokens?model=openrouter%2Fgpt-4o-mini&include=usage",
            uri.to_string()
        );
    }

    #[test]
    fn route_scoped_uri_appends_provider_query_auth() {
        let target = ProviderPassthroughTarget::new(
            "google",
            "https://generativelanguage.googleapis.com/v1beta".to_owned(),
            ProviderPassthroughAuth::query("key", "sk-google+query/value").unwrap(),
            Vec::new(),
        );

        let uri = build_route_scoped_openai_passthrough_uri(
            &target,
            &"/v1/files?purpose=assistants".parse().unwrap(),
            None,
            None,
        )
        .unwrap();

        assert_eq!(
            "https://generativelanguage.googleapis.com/v1beta/v1/files?purpose=assistants&key=sk-google%2Bquery%2Fvalue",
            uri.to_string()
        );
    }
}
