use crate::gateway_api_key_auth::authenticate_gateway_api_key;
use crate::openai_passthrough_routes::{
    apply_openai_method_passthrough_routes, apply_openai_passthrough_routes,
    apply_stored_chat_completion_passthrough_routes,
};
use crate::provider_passthrough_transport::{
    build_provider_passthrough_client, forward_provider_passthrough_to_target, PassthroughClient,
    ProviderPassthroughTarget,
};
use axum::extract::Request;
use axum::extract::State;
use axum::http::HeaderMap;
use axum::http::{StatusCode, Uri};
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, MethodRouter};
use axum::{Json, Router};
use http_body_util::BodyExt;
use sdkwork_claw_config::{ProviderPassthroughAuth, ProviderRelayConfig};
use sdkwork_claw_product::application::ApiKeySecretHasher;
use sdkwork_claw_product::ports::{PricingCatalog, ProviderSecretResolver};
use serde_json::json;
use std::sync::Arc;

#[derive(Clone)]
struct ProviderPassthroughRuntime {
    client: PassthroughClient,
    providers: Arc<Vec<ProviderPassthroughTarget>>,
}

const PROVIDER_NATIVE_PASSTHROUGH_PROVIDERS: &[&str] = &[
    "openai",
    "google",
    "anthropic",
    "volcengine",
    "suno",
    "midjourney",
    "kling",
    "vidu",
    "nano-banana",
];

pub fn provider_native_passthrough_providers() -> &'static [&'static str] {
    PROVIDER_NATIVE_PASSTHROUGH_PROVIDERS
}

pub fn gateway_passthrough_router() -> Router {
    apply_provider_native_passthrough_routes(
        openai_passthrough_placeholder_router(),
        MethodRouter::new().fallback(provider_passthrough_not_configured),
    )
}

fn apply_provider_native_passthrough_routes<S>(
    mut router: Router<S>,
    handler: MethodRouter<S>,
) -> Router<S>
where
    S: Clone + Send + Sync + 'static,
{
    for provider in PROVIDER_NATIVE_PASSTHROUGH_PROVIDERS {
        let vendor_path = format!("/{provider}/{{*path}}");
        let legacy_path = format!("/provider/{provider}/{{*path}}");
        router = router
            .route(&vendor_path, handler.clone())
            .route(&legacy_path, handler.clone());
    }
    router
}

pub fn router_with_provider_passthrough_config(config: ProviderRelayConfig) -> Router {
    provider_passthrough_router_with_runtime(ProviderPassthroughRuntime::from_config(config))
}

pub fn authenticated_gateway_passthrough_router<C>(
    config: ProviderRelayConfig,
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let runtime = ProviderPassthroughRuntime::from_config(config);
    let state = AuthenticatedProviderPassthroughState {
        runtime,
        catalog,
        api_key_hasher,
    };
    let openai_router = if state.runtime.has_openai_target() {
        authenticated_openai_passthrough_router::<C>(state.clone())
    } else {
        openai_passthrough_placeholder_router()
    };
    openai_router.merge(authenticated_provider_passthrough_router::<C>(state))
}

pub fn authenticated_provider_native_passthrough_router<C>(
    config: ProviderRelayConfig,
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    authenticated_provider_passthrough_router::<C>(AuthenticatedProviderPassthroughState {
        runtime: ProviderPassthroughRuntime::from_config(config),
        catalog,
        api_key_hasher,
    })
}

pub fn route_scoped_openai_passthrough_router<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    secret_resolver: Arc<dyn ProviderSecretResolver + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    crate::route_scoped_openai_passthrough::router(catalog, api_key_hasher, secret_resolver)
}

fn openai_passthrough_placeholder_router() -> Router<()> {
    let router = apply_openai_passthrough_routes(
        Router::new(),
        MethodRouter::new().fallback(openai_passthrough_not_configured),
    );
    let router = apply_openai_method_passthrough_routes(
        router,
        MethodRouter::new().fallback(openai_passthrough_not_configured),
    );
    apply_stored_chat_completion_passthrough_routes(
        router,
        MethodRouter::new().fallback(openai_passthrough_not_configured),
    )
}

fn authenticated_openai_passthrough_router<C>(
    state: AuthenticatedProviderPassthroughState<C>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    apply_openai_passthrough_routes(
        Router::new(),
        MethodRouter::new().fallback(authenticated_forward_openai_passthrough::<C>),
    )
    .route(
        "/v1/models/{model}",
        delete(authenticated_forward_openai_passthrough::<C>),
    )
    .with_state(state)
}

pub fn authenticated_stored_chat_completion_passthrough_router<C>(
    config: ProviderRelayConfig,
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let runtime = ProviderPassthroughRuntime::from_config(config);
    let state = AuthenticatedProviderPassthroughState {
        runtime,
        catalog,
        api_key_hasher,
    };
    if state.runtime.has_openai_target() {
        apply_stored_chat_completion_passthrough_routes(
            Router::new(),
            MethodRouter::new().fallback(authenticated_forward_openai_passthrough::<C>),
        )
        .with_state(state)
    } else {
        Router::new()
    }
}

fn authenticated_provider_passthrough_router<C>(
    state: AuthenticatedProviderPassthroughState<C>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    apply_provider_native_passthrough_routes(
        Router::new(),
        MethodRouter::new().fallback(authenticated_forward_provider_passthrough::<C>),
    )
    .with_state(state)
}

fn provider_passthrough_router_with_runtime(runtime: ProviderPassthroughRuntime) -> Router {
    apply_provider_native_passthrough_routes(
        Router::new(),
        MethodRouter::new().fallback(forward_provider_passthrough),
    )
    .with_state(runtime)
}

async fn openai_passthrough_not_configured(request: Request) -> Response {
    passthrough_not_configured(
        "openai_passthrough_not_configured",
        "OpenAI-compatible passthrough route is declared but no upstream relay is configured.",
        request.uri().path(),
    )
}

async fn provider_passthrough_not_configured(request: Request) -> Response {
    passthrough_not_configured(
        "provider_passthrough_not_configured",
        "Provider-native passthrough route is declared but no upstream relay is configured.",
        request.uri().path(),
    )
}

async fn forward_provider_passthrough(
    axum::extract::State(runtime): axum::extract::State<ProviderPassthroughRuntime>,
    request: Request,
) -> Response {
    match runtime.forward(request).await {
        Ok(response) => response,
        Err(message) => (
            StatusCode::BAD_GATEWAY,
            Json(json!({
                "error": {
                    "message": message,
                    "type": "server_error",
                    "param": null,
                    "code": "provider_passthrough_relay_failed"
                }
            })),
        )
            .into_response(),
    }
}

async fn authenticated_forward_provider_passthrough<C>(
    State(state): State<AuthenticatedProviderPassthroughState<C>>,
    headers: HeaderMap,
    uri: Uri,
    request: Request,
) -> Response
where
    C: PricingCatalog + Send + Sync + 'static,
{
    if let Err(response) = authenticate_passthrough_api_key(&state, &headers, &uri) {
        return response;
    }
    match state.runtime.forward(request).await {
        Ok(response) => response,
        Err(message) => passthrough_relay_failed("provider_passthrough_relay_failed", message),
    }
}

async fn authenticated_forward_openai_passthrough<C>(
    State(state): State<AuthenticatedProviderPassthroughState<C>>,
    headers: HeaderMap,
    uri: Uri,
    request: Request,
) -> Response
where
    C: PricingCatalog + Send + Sync + 'static,
{
    if let Err(response) = authenticate_passthrough_api_key(&state, &headers, &uri) {
        return response;
    }
    match state.runtime.forward_openai(request).await {
        Ok(response) => response,
        Err(message) => passthrough_relay_failed("openai_passthrough_relay_failed", message),
    }
}

fn passthrough_not_configured(code: &'static str, message: &'static str, path: &str) -> Response {
    (
        StatusCode::NOT_IMPLEMENTED,
        Json(json!({
            "error": {
                "message": message,
                "type": "server_error",
                "param": null,
                "code": code,
                "path": path
            }
        })),
    )
        .into_response()
}

fn passthrough_relay_failed(code: &'static str, message: String) -> Response {
    (
        StatusCode::BAD_GATEWAY,
        Json(json!({
            "error": {
                "message": message,
                "type": "server_error",
                "param": null,
                "code": code
            }
        })),
    )
        .into_response()
}

struct AuthenticatedProviderPassthroughState<C> {
    runtime: ProviderPassthroughRuntime,
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
}

impl<C> Clone for AuthenticatedProviderPassthroughState<C> {
    fn clone(&self) -> Self {
        Self {
            runtime: self.runtime.clone(),
            catalog: Arc::clone(&self.catalog),
            api_key_hasher: Arc::clone(&self.api_key_hasher),
        }
    }
}

fn authenticate_passthrough_api_key<C>(
    state: &AuthenticatedProviderPassthroughState<C>,
    headers: &HeaderMap,
    uri: &Uri,
) -> Result<(), Response>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    authenticate_gateway_api_key(
        state.catalog.as_ref(),
        state.api_key_hasher.as_ref(),
        headers,
        uri,
    )
    .map(|_| ())
}

impl ProviderPassthroughRuntime {
    fn from_config(config: ProviderRelayConfig) -> Self {
        let openai_target = config.openai_relay().map(|relay| {
            ProviderPassthroughTarget::new(
                "openai",
                relay.base_url().trim_end_matches('/').to_owned(),
                ProviderPassthroughAuth::bearer(relay.bearer_token())
                    .expect("OpenAI relay bearer token is validated by config parser"),
                Vec::new(),
            )
        });
        Self {
            client: build_provider_passthrough_client(),
            providers: Arc::new(
                openai_target
                    .into_iter()
                    .chain(config.provider_passthrough_targets().iter().map(|target| {
                        ProviderPassthroughTarget::new(
                            target.provider(),
                            target.base_url().trim_end_matches('/').to_owned(),
                            target.auth().clone(),
                            target.default_headers().to_vec(),
                        )
                    }))
                    .collect(),
            ),
        }
    }

    async fn forward(&self, request: Request) -> Result<Response, String> {
        let target = self
            .target_for_path(request.uri().path())
            .ok_or_else(|| "provider passthrough target is not configured".to_owned())?;
        let upstream_uri = build_provider_passthrough_uri(target, request.uri())?;
        self.forward_to_target(request, target, upstream_uri).await
    }

    async fn forward_openai(&self, request: Request) -> Result<Response, String> {
        let target = self
            .providers
            .iter()
            .find(|target| target.provider() == "openai")
            .ok_or_else(|| "OpenAI-compatible passthrough target is not configured".to_owned())?;
        let upstream_uri = build_openai_passthrough_uri(target, request.uri())?;
        self.forward_to_target(request, target, upstream_uri).await
    }

    async fn forward_to_target(
        &self,
        request: Request,
        target: &ProviderPassthroughTarget,
        upstream_uri: Uri,
    ) -> Result<Response, String> {
        let (parts, body) = request.into_parts();
        let body = body
            .collect()
            .await
            .map_err(|error| format!("failed to read provider passthrough body: {error}"))?
            .to_bytes();
        forward_provider_passthrough_to_target(&self.client, parts, body, target, upstream_uri)
            .await
    }

    fn target_for_path(&self, path: &str) -> Option<&ProviderPassthroughTarget> {
        provider_from_passthrough_path(path).and_then(|provider| {
            self.providers
                .iter()
                .find(|target| target.provider() == provider)
        })
    }

    fn has_openai_target(&self) -> bool {
        self.providers
            .iter()
            .any(|target| target.provider() == "openai")
    }
}

fn build_openai_passthrough_uri(
    target: &ProviderPassthroughTarget,
    original_uri: &Uri,
) -> Result<Uri, String> {
    let path = target.normalize_openai_compatible_path(original_uri.path());
    let path_and_query = match original_uri.query() {
        Some(query) => format!("{path}?{query}"),
        None => path,
    };
    target
        .build_uri(path_and_query)
        .map_err(|error| format!("invalid OpenAI-compatible passthrough upstream URI: {error}"))
}

fn build_provider_passthrough_uri(
    target: &ProviderPassthroughTarget,
    original_uri: &Uri,
) -> Result<Uri, String> {
    let (_, provider_path) = split_provider_passthrough_path(original_uri.path())
        .ok_or_else(|| "provider passthrough path is invalid".to_owned())?;
    let path_and_query = match original_uri.query() {
        Some(query) => format!("/{provider_path}?{query}"),
        None => format!("/{provider_path}"),
    };
    target.build_uri(path_and_query)
}

fn provider_from_passthrough_path(path: &str) -> Option<&str> {
    split_provider_passthrough_path(path).map(|(provider, _)| provider)
}

fn split_provider_passthrough_path(path: &str) -> Option<(&str, &str)> {
    let path = path
        .strip_prefix("/provider/")
        .or_else(|| path.strip_prefix('/'))?;
    let (provider, provider_path) = path.split_once('/')?;
    (!provider.is_empty() && !provider_path.is_empty()).then_some((provider, provider_path))
}
