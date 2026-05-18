use std::sync::Arc;
use std::time::Instant;

use axum::body::Bytes;
use axum::extract::State;
use axum::http::{HeaderMap, StatusCode, Uri};
use axum::response::IntoResponse;
use axum::response::Response;
use axum::routing::post;
use axum::Json;
use axum::Router;
use sdkwork_claw_http::ApiKeyIdentity;
use serde_json::Value;

use crate::api::openai_contract::OpenAiResponsesRequest;
use crate::api::openai_error::openai_error;
use crate::api::openai_invocation::{
    notify_after_relay_observers, notify_after_route_selection, notify_before_relay,
    notify_before_route_selection, notify_error, notify_route_fault, notify_route_success,
    with_builtin_invocation_plugins, OpenAiInvocationContext, OpenAiInvocationEndpoint, OpenAiInvocationFault,
    OpenAiInvocationPluginError, OpenAiInvocationPluginRef, OpenAiInvocationRelayOutcome,
};
use crate::api::openai_runtime::{
    authenticate_api_key, resolve_openai_provider_route_plan, route_http_status_is_retryable,
    OpenAiRouteError, OpenAiRuntimeFailureStrategy, OpenAiRuntimeRouteConfig, ResolvedOpenAiProviderRoute,
    ResolvedOpenAiProviderRoutePlan,
};
use crate::api::openai_usage::OpenAiUsageRecorder;
use crate::application::{ApiKeySecretHasher, AuthenticatedApiKeyContext};
use crate::domain::{BillingMeter, ProviderRetryPolicy, RoutingCapability};
use crate::ports::{GatewayUsageRecorder, PricingCatalog, ResponsesRelay, ResponsesRelayRequest};

struct OpenAiResponsesState<C> {
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Option<Arc<dyn ResponsesRelay + Send + Sync>>,
    usage_recorder: Option<Arc<dyn GatewayUsageRecorder + Send + Sync>>,
    usage_recording: Option<Arc<OpenAiUsageRecorder<C>>>,
    plugins: Vec<OpenAiInvocationPluginRef>,
    failure_strategy: OpenAiRuntimeFailureStrategy,
    default_retry_policy: ProviderRetryPolicy,
}

impl<C> Clone for OpenAiResponsesState<C> {
    fn clone(&self) -> Self {
        Self {
            catalog: Arc::clone(&self.catalog),
            api_key_hasher: Arc::clone(&self.api_key_hasher),
            relay: self.relay.clone(),
            usage_recorder: self.usage_recorder.clone(),
            usage_recording: self.usage_recording.clone(),
            plugins: self.plugins.clone(),
            failure_strategy: self.failure_strategy,
            default_retry_policy: self.default_retry_policy.clone(),
        }
    }
}

struct ParsedOpenAiResponsesRequest {
    model: String,
    stream: bool,
    request_body: Value,
}

pub fn openai_responses_router<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_responses_router_with_optional_relay(catalog, api_key_hasher, None, None, Vec::new())
}

pub fn openai_responses_router_with_relay<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Arc<dyn ResponsesRelay + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_responses_router_with_optional_relay(
        catalog,
        api_key_hasher,
        Some(relay),
        None,
        Vec::new(),
    )
}

pub fn openai_responses_router_with_relay_and_plugins<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Arc<dyn ResponsesRelay + Send + Sync>,
    plugins: Vec<OpenAiInvocationPluginRef>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_responses_router_with_optional_relay(catalog, api_key_hasher, Some(relay), None, plugins)
}

pub fn openai_responses_router_with_relay_plugins_and_failure_strategy<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Arc<dyn ResponsesRelay + Send + Sync>,
    plugins: Vec<OpenAiInvocationPluginRef>,
    failure_strategy: OpenAiRuntimeFailureStrategy,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_responses_router_with_optional_relay_and_failure_strategy(
        catalog,
        api_key_hasher,
        Some(relay),
        None,
        plugins,
        failure_strategy,
    )
}

pub fn openai_responses_router_with_relay_and_usage_recorder<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Arc<dyn ResponsesRelay + Send + Sync>,
    usage_recorder: Arc<dyn GatewayUsageRecorder + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_responses_router_with_optional_relay(
        catalog,
        api_key_hasher,
        Some(relay),
        Some(usage_recorder),
        Vec::new(),
    )
}

pub fn openai_responses_router_with_relay_and_usage_recorder_and_plugins<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Arc<dyn ResponsesRelay + Send + Sync>,
    usage_recorder: Arc<dyn GatewayUsageRecorder + Send + Sync>,
    plugins: Vec<OpenAiInvocationPluginRef>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_responses_router_with_relay_usage_recorder_plugins_and_failure_strategy(
        catalog,
        api_key_hasher,
        relay,
        usage_recorder,
        plugins,
        OpenAiRuntimeFailureStrategy::default(),
    )
}

pub fn openai_responses_router_with_relay_usage_recorder_plugins_and_failure_strategy<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Arc<dyn ResponsesRelay + Send + Sync>,
    usage_recorder: Arc<dyn GatewayUsageRecorder + Send + Sync>,
    plugins: Vec<OpenAiInvocationPluginRef>,
    failure_strategy: OpenAiRuntimeFailureStrategy,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_responses_router_with_optional_relay_and_failure_strategy(
        catalog,
        api_key_hasher,
        Some(relay),
        Some(usage_recorder),
        plugins,
        failure_strategy,
    )
}

pub fn openai_responses_router_with_relay_usage_recorder_plugins_and_runtime_config<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Arc<dyn ResponsesRelay + Send + Sync>,
    usage_recorder: Arc<dyn GatewayUsageRecorder + Send + Sync>,
    plugins: Vec<OpenAiInvocationPluginRef>,
    runtime_config: OpenAiRuntimeRouteConfig,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_responses_router_with_optional_relay_and_runtime_config(
        catalog,
        api_key_hasher,
        Some(relay),
        Some(usage_recorder),
        plugins,
        runtime_config,
    )
}

fn openai_responses_router_with_optional_relay<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Option<Arc<dyn ResponsesRelay + Send + Sync>>,
    usage_recorder: Option<Arc<dyn GatewayUsageRecorder + Send + Sync>>,
    plugins: Vec<OpenAiInvocationPluginRef>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_responses_router_with_optional_relay_and_failure_strategy(
        catalog,
        api_key_hasher,
        relay,
        usage_recorder,
        plugins,
        OpenAiRuntimeFailureStrategy::default(),
    )
}

fn openai_responses_router_with_optional_relay_and_failure_strategy<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Option<Arc<dyn ResponsesRelay + Send + Sync>>,
    usage_recorder: Option<Arc<dyn GatewayUsageRecorder + Send + Sync>>,
    plugins: Vec<OpenAiInvocationPluginRef>,
    failure_strategy: OpenAiRuntimeFailureStrategy,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_responses_router_with_optional_relay_and_runtime_config(
        catalog,
        api_key_hasher,
        relay,
        usage_recorder,
        plugins,
        OpenAiRuntimeRouteConfig::new(ProviderRetryPolicy::default(), failure_strategy),
    )
}

fn openai_responses_router_with_optional_relay_and_runtime_config<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Option<Arc<dyn ResponsesRelay + Send + Sync>>,
    usage_recorder: Option<Arc<dyn GatewayUsageRecorder + Send + Sync>>,
    plugins: Vec<OpenAiInvocationPluginRef>,
    runtime_config: OpenAiRuntimeRouteConfig,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let usage_recording = usage_recorder.as_ref().map(|usage_recorder| {
        Arc::new(OpenAiUsageRecorder::new(
            Arc::clone(&catalog),
            Arc::clone(usage_recorder),
        ))
    });

    Router::new()
        .route("/v1/responses", post(create_response::<C>))
        .with_state(OpenAiResponsesState {
            catalog,
            api_key_hasher,
            relay,
            usage_recorder,
            usage_recording,
            plugins: with_builtin_invocation_plugins(plugins),
            failure_strategy: runtime_config.failure_strategy,
            default_retry_policy: runtime_config.default_retry_policy,
        })
}

async fn create_response<C>(
    State(state): State<OpenAiResponsesState<C>>,
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
    let invocation_context = OpenAiInvocationContext::new(
        OpenAiInvocationEndpoint::Responses,
        context.clone(),
        request.model.clone(),
        request.stream,
        request.request_body.clone(),
        &headers,
        &uri,
    );
    if let Err(error) = notify_before_route_selection(&state.plugins, &invocation_context).await {
        notify_error(&state.plugins, &invocation_context, None, &error).await;
        return error.into_openai_response();
    }
    let mut route_plan = match validate_responses_model(&state, &context, &request.model) {
        Ok(route_plan) => route_plan,
        Err(response) => return *response,
    };
    let mut route = route_plan.first_route();
    if let Err(error) =
        notify_after_route_selection(&state.plugins, &invocation_context, &mut route).await
    {
        notify_error(&state.plugins, &invocation_context, Some(&route), &error).await;
        return error.into_openai_response();
    }
    if let Some(first_route) = route_plan.routes.first_mut() {
        *first_route = route.clone();
    }

    if request.stream {
        return openai_error(
            StatusCode::NOT_IMPLEMENTED,
            "streaming_relay_not_configured",
            "server_error",
            "streaming provider relay is not implemented for /v1/responses",
        );
    }

    let Some(relay) = state.relay.as_ref() else {
        return openai_error(
            StatusCode::NOT_IMPLEMENTED,
            "responses_relay_not_configured",
            "server_error",
            "provider relay is not implemented for /v1/responses",
        );
    };

    match relay_response(
        relay.as_ref(),
        state.usage_recording.clone(),
        &state.plugins,
        &invocation_context,
        context,
        route_plan,
        request,
        state.failure_strategy,
        &state.default_retry_policy,
    )
    .await
    {
        Ok(response) => response,
        Err(response) => response,
    }
}

fn parse_request(body: &[u8]) -> Result<ParsedOpenAiResponsesRequest, String> {
    let request_body: Value =
        serde_json::from_slice(body).map_err(|error| format!("invalid request body: {error}"))?;
    let request: OpenAiResponsesRequest = serde_json::from_value(request_body.clone())
        .map_err(|error| format!("invalid request body: {error}"))?;
    if request.model.trim().is_empty() {
        return Err("model is required".to_owned());
    }
    if request.input.is_null() {
        return Err("input is required".to_owned());
    }
    Ok(ParsedOpenAiResponsesRequest {
        model: request.model,
        stream: request.stream.unwrap_or(false),
        request_body,
    })
}

fn validate_responses_model<C>(
    state: &OpenAiResponsesState<C>,
    context: &AuthenticatedApiKeyContext,
    model: &str,
) -> Result<ResolvedOpenAiProviderRoutePlan, OpenAiRouteError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    resolve_openai_provider_route_plan(
        state.catalog.as_ref(),
        context,
        model,
        &["response", "responses"],
        "responses",
        RoutingCapability::Chat,
        BillingMeter::LlmInputToken,
    )
}

async fn relay_response(
    relay: &(dyn ResponsesRelay + Send + Sync),
    usage_recording: Option<Arc<OpenAiUsageRecorder<impl PricingCatalog + Send + Sync + 'static>>>,
    plugins: &[OpenAiInvocationPluginRef],
    invocation_context: &OpenAiInvocationContext,
    context: AuthenticatedApiKeyContext,
    route_plan: ResolvedOpenAiProviderRoutePlan,
    request: ParsedOpenAiResponsesRequest,
    failure_strategy: OpenAiRuntimeFailureStrategy,
    default_retry_policy: &ProviderRetryPolicy,
) -> Result<Response, Response> {
    let requested_model = request.model;
    let request_body = request.request_body;
    let mut last_error = None;
    let route_count = route_plan.routes.len();
    for (index, mut route) in route_plan.routes.into_iter().enumerate() {
        let is_last_route = index + 1 == route_count;
        if let Err(error) = notify_before_relay(plugins, invocation_context, &mut route).await {
            notify_error(plugins, invocation_context, Some(&route), &error).await;
            return Err(error.into_openai_response());
        }
        match relay_response_route(
            relay,
            usage_recording.as_ref(),
            plugins,
            invocation_context,
            &context,
            &route,
            &requested_model,
            request_body.clone(),
            default_retry_policy,
        )
        .await
        {
            Ok(response) => return Ok(response),
            Err(RouteRelayFailure::Retryable(response))
                if failure_strategy.should_try_next_route(is_last_route) =>
            {
                last_error = Some(response);
                continue;
            }
            Err(RouteRelayFailure::Retryable(response))
            | Err(RouteRelayFailure::Terminal(response)) => return Err(response),
        }
    }
    Err(last_error.unwrap_or_else(|| {
        openai_error(
            StatusCode::BAD_GATEWAY,
            "provider_relay_failed",
            "server_error",
            "provider relay failed for all configured route candidates",
        )
    }))
}

enum RouteRelayFailure {
    Retryable(Response),
    Terminal(Response),
}

fn elapsed_millis(started_at: Instant) -> i64 {
    started_at.elapsed().as_millis().clamp(1, i64::MAX as u128) as i64
}

async fn relay_response_route(
    relay: &(dyn ResponsesRelay + Send + Sync),
    usage_recording: Option<&Arc<OpenAiUsageRecorder<impl PricingCatalog + Send + Sync + 'static>>>,
    plugins: &[OpenAiInvocationPluginRef],
    invocation_context: &OpenAiInvocationContext,
    context: &AuthenticatedApiKeyContext,
    route: &ResolvedOpenAiProviderRoute,
    requested_model: &str,
    request_body: serde_json::Value,
    default_retry_policy: &ProviderRetryPolicy,
) -> Result<Response, RouteRelayFailure> {
    let started_at = Instant::now();
    let response = match relay
        .create_response(ResponsesRelayRequest {
            api_key_id: context.api_key_id,
            tenant_id: context.tenant_id,
            organization_id: context.organization_id,
            user_id: context.user_id,
            group_id: context.group_id,
            group_code: context.group_code.clone(),
            pricing_plan_code: context.pricing_plan_code.clone(),
            model: requested_model.to_owned(),
            provider_code: route.provider_code.clone(),
            provider_model: route.provider_model.clone(),
            provider_base_url: route.provider_base_url.clone(),
            provider_secret_ref: route.provider_secret_ref.clone(),
            provider_auth_profile: route.provider_auth_profile.clone(),
            provider_timeout_ms: route.provider_timeout_ms,
            provider_retry_policy: route.provider_retry_policy.clone(),
            request_body,
        })
        .await
    {
        Ok(response) => response,
        Err(error) => {
            let fault = OpenAiInvocationFault::relay_transport(error.to_string())
                .with_latency_ms(elapsed_millis(started_at));
            let plugin_error = OpenAiInvocationPluginError::new(
                StatusCode::BAD_GATEWAY,
                "provider_relay_failed",
                "server_error",
                fault.message.clone(),
            );
            notify_route_fault(plugins, invocation_context, route, &fault).await;
            notify_error(plugins, invocation_context, Some(route), &plugin_error).await;
            return Err(RouteRelayFailure::Retryable(
                plugin_error.into_openai_response(),
            ));
        }
    };

    let status = match StatusCode::from_u16(response.status_code) {
        Ok(status) => status,
        Err(_) => {
            let fault = OpenAiInvocationFault::relay_invalid_status(
                "provider relay returned an invalid HTTP status",
            )
            .with_latency_ms(elapsed_millis(started_at));
            notify_route_fault(plugins, invocation_context, route, &fault).await;
            return Err(RouteRelayFailure::Retryable(openai_error(
                StatusCode::BAD_GATEWAY,
                "provider_relay_invalid_status",
                "server_error",
                "provider relay returned an invalid HTTP status",
            )));
        }
    };
    let outcome = OpenAiInvocationRelayOutcome::json(response.status_code, response.body.clone())
        .with_latency_ms(elapsed_millis(started_at));
    if !status.is_success() {
        let retryable =
            route_http_status_is_retryable(route, default_retry_policy, response.status_code);
        let fault = OpenAiInvocationFault::relay_http_status(
            response.status_code,
            retryable,
            format!("provider relay returned HTTP {}", response.status_code),
        )
        .with_latency_ms(elapsed_millis(started_at));
        notify_route_fault(plugins, invocation_context, route, &fault).await;
        notify_after_relay_observers(plugins, invocation_context, route, &outcome).await;
        let response = (status, Json(response.body)).into_response();
        return if retryable {
            Err(RouteRelayFailure::Retryable(response))
        } else {
            Err(RouteRelayFailure::Terminal(response))
        };
    }
    notify_route_success(plugins, invocation_context, route, &outcome).await;
    if let Some(usage_recording) = usage_recording {
        if let Err(fault) = usage_recording
            .record_after_success(invocation_context, route, &outcome)
            .await
        {
            notify_route_fault(plugins, invocation_context, route, &fault).await;
            let error = OpenAiInvocationPluginError::new(
                StatusCode::BAD_GATEWAY,
                "provider_usage_record_failed",
                "server_error",
                fault.message,
            );
            notify_error(plugins, invocation_context, Some(route), &error).await;
            return Err(RouteRelayFailure::Terminal(error.into_openai_response()));
        }
    }
    notify_after_relay_observers(plugins, invocation_context, route, &outcome).await;
    Ok((status, Json(response.body)).into_response())
}
