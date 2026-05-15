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
use axum::extract::{Request, State};
use axum::http::request::Parts as RequestParts;
use axum::http::{HeaderMap, StatusCode, Uri};
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, MethodRouter};
use axum::{Json, Router};
use http_body_util::BodyExt;
#[cfg(test)]
use sdkwork_claw_config::ProviderPassthroughAuth;
use sdkwork_claw_product::application::{
    ApiKeySecretHasher, AuthenticatedApiKeyContext, ProviderRouteSelectionError,
    ProviderRouteSelectionErrorKind, ProviderRouteSelector, SelectProviderAccountPoolRouteQuery,
    SelectProviderRouteQuery,
};
use sdkwork_claw_product::domain::{
    AiModel, BillingMeter, ModelProviderRoute, ProviderAccountPoolRoute, ProviderAuthProfile,
    RoutingCapability,
};
use sdkwork_claw_product::ports::{PricingCatalog, ProviderSecretResolver};
use serde_json::json;
use std::sync::Arc;

#[derive(Clone)]
struct RouteScopedOpenAiPassthroughRuntime {
    client: PassthroughClient,
    secret_resolver: Arc<dyn ProviderSecretResolver + Send + Sync>,
}

struct RouteScopedOpenAiPassthroughState<C> {
    runtime: RouteScopedOpenAiPassthroughRuntime,
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
}

impl<C> Clone for RouteScopedOpenAiPassthroughState<C> {
    fn clone(&self) -> Self {
        Self {
            runtime: self.runtime.clone(),
            catalog: Arc::clone(&self.catalog),
            api_key_hasher: Arc::clone(&self.api_key_hasher),
        }
    }
}

pub(crate) fn router<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    secret_resolver: Arc<dyn ProviderSecretResolver + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let state = RouteScopedOpenAiPassthroughState {
        runtime: RouteScopedOpenAiPassthroughRuntime::new(secret_resolver),
        catalog,
        api_key_hasher,
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
        .forward_openai(state.catalog.as_ref(), context, request)
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
        catalog: &C,
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
        let route = select_route_scoped_openai_passthrough_target(catalog, context, &intent)?;
        let base_url = route.base_url.ok_or_else(|| {
            RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                "provider route is not available for configured account pool: selected channel {} has no base URL",
                route.channel_id
            ))
        })?;
        let secret_ref = route.secret_ref.ok_or_else(|| {
            RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                "provider route is not available for configured account pool: selected channel {} has no secret_ref",
                route.channel_id
            ))
        })?;
        let secret_value = self
            .secret_resolver
            .resolve_secret_value(&secret_ref)
            .map_err(|error| {
                RouteScopedOpenAiPassthroughError::provider_route_unavailable(format!(
                    "provider route is not available for configured account pool: {error}"
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
        forward_provider_passthrough_to_target(&self.client, parts, body, &target, upstream_uri)
            .await
            .map_err(RouteScopedOpenAiPassthroughError::relay_failed)
    }
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
            Ok(model_route_to_passthrough_target(selection.route))
        }
        _ => {
            let selection = ProviderRouteSelector::new(catalog).select_account_pool(
                SelectProviderAccountPoolRouteQuery {
                    context,
                    route_key: intent.route_key.clone(),
                    capability: intent.capability,
                },
            )?;
            Ok(account_pool_route_to_passthrough_target(selection.route))
        }
    }
}

fn model_route_to_passthrough_target(
    route: ModelProviderRoute,
) -> RouteScopedOpenAiPassthroughTarget {
    RouteScopedOpenAiPassthroughTarget {
        provider_code: route.provider_code,
        channel_id: route.channel_id,
        provider_model: Some(route.provider_model),
        base_url: route.base_url,
        secret_ref: route.secret_ref,
        auth_profile: route.auth_profile,
    }
}

fn account_pool_route_to_passthrough_target(
    route: ProviderAccountPoolRoute,
) -> RouteScopedOpenAiPassthroughTarget {
    RouteScopedOpenAiPassthroughTarget {
        provider_code: route.provider_code,
        channel_id: route.channel_id,
        provider_model: None,
        base_url: route.base_url,
        secret_ref: route.secret_ref,
        auth_profile: route.auth_profile,
    }
}

fn find_catalog_model_for_passthrough<C>(
    catalog: &C,
    model: &str,
) -> Result<AiModel, RouteScopedOpenAiPassthroughError>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    if model.contains('/') {
        return catalog
            .find_model(model)
            .ok_or_else(|| RouteScopedOpenAiPassthroughError::model_not_found(model));
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
