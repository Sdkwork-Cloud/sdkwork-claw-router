use std::sync::Arc;

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
use crate::api::openai_runtime::{
    authenticate_api_key, ensure_model_capability, find_catalog_model, first_priced_provider_route,
    OpenAiRouteError,
};
use crate::application::{ApiKeySecretHasher, AuthenticatedApiKeyContext};
use crate::domain::{BillingMeter, ModelProviderRoute};
use crate::ports::{PricingCatalog, ResponsesRelay, ResponsesRelayRequest};

struct OpenAiResponsesState<C> {
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Option<Arc<dyn ResponsesRelay + Send + Sync>>,
}

impl<C> Clone for OpenAiResponsesState<C> {
    fn clone(&self) -> Self {
        Self {
            catalog: Arc::clone(&self.catalog),
            api_key_hasher: Arc::clone(&self.api_key_hasher),
            relay: self.relay.clone(),
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
    openai_responses_router_with_optional_relay(catalog, api_key_hasher, None)
}

pub fn openai_responses_router_with_relay<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Arc<dyn ResponsesRelay + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    openai_responses_router_with_optional_relay(catalog, api_key_hasher, Some(relay))
}

fn openai_responses_router_with_optional_relay<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    relay: Option<Arc<dyn ResponsesRelay + Send + Sync>>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    Router::new()
        .route("/v1/responses", post(create_response::<C>))
        .with_state(OpenAiResponsesState {
            catalog,
            api_key_hasher,
            relay,
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
    let route = match validate_responses_model(&state, &context, &request.model) {
        Ok(route) => route,
        Err(response) => return *response,
    };

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

    match relay_response(relay.as_ref(), context, route, request).await {
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
) -> Result<ModelProviderRoute, OpenAiRouteError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let catalog_model = find_catalog_model(state.catalog.as_ref(), model)?;
    ensure_model_capability(&catalog_model, &["response", "responses"], "responses")?;
    first_priced_provider_route(
        state.catalog.as_ref(),
        context,
        model,
        BillingMeter::LlmInputToken,
    )
}

async fn relay_response(
    relay: &(dyn ResponsesRelay + Send + Sync),
    context: AuthenticatedApiKeyContext,
    route: ModelProviderRoute,
    request: ParsedOpenAiResponsesRequest,
) -> Result<Response, Response> {
    let response = relay
        .create_response(ResponsesRelayRequest {
            api_key_id: context.api_key_id,
            group_id: context.group_id,
            group_code: context.group_code,
            pricing_plan_code: context.pricing_plan_code,
            model: request.model,
            provider_code: route.provider_code,
            provider_model: route.provider_model,
            provider_base_url: route.base_url,
            provider_secret_ref: route.secret_ref,
            provider_timeout_ms: route.timeout_ms,
            provider_retry_policy: route.retry_policy,
            request_body: request.request_body,
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
    Ok((status, Json(response.body)).into_response())
}
