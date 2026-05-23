use crate::gateway_api_key_auth::authenticate_gateway_api_key;
use crate::openai_passthrough_routes::{
    apply_openai_method_passthrough_routes, apply_openai_passthrough_routes,
    apply_stored_chat_completion_passthrough_routes,
};
use crate::provider_account_auth::render_provider_account_auth;
use crate::provider_passthrough_transport::{
    build_provider_passthrough_client, forward_provider_passthrough_to_target, PassthroughClient,
    ProviderPassthroughTarget,
};
use axum::body::Body;
use axum::extract::Request;
use axum::extract::State;
use axum::http::header::{HeaderName, HeaderValue};
use axum::http::HeaderMap;
use axum::http::{StatusCode, Uri};
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, MethodRouter};
use axum::{Json, Router};
use http_body_util::BodyExt;
use sdkwork_claw_config::{
    ProviderAdapterConfig, ProviderPassthroughAuth, ProviderPassthroughAuthType,
    ProviderRelayConfig,
};
use sdkwork_claw_product::application::{
    ApiKeySecretHasher, AuthenticatedApiKeyContext, ProviderRouteSelector,
    SelectProviderAccountPoolRouteQuery,
};
use sdkwork_claw_product::domain::{ProviderAccountPoolRoute, RoutingCapability};
use sdkwork_claw_product::ports::{PricingCatalog, ProviderSecretResolver};
use sdkwork_claw_provider_adapter_contract::{
    AdapterInvocationMetadata, AdapterInvocationRequest, AdapterInvocationResponse,
    AdapterInvocationShape, AdapterProviderContext, AdapterSecret, AdapterSubject,
};
use sdkwork_claw_provider_adapter_http::{ProviderAdapterHttpClient, ProviderAdapterHttpError};
use sdkwork_claw_provider_adapter_registry::{
    ProviderAdapterLookup, ProviderAdapterRegistry, ProviderAdapterRouteConfig,
    ProviderInvocationMode,
};
use serde_json::json;
use serde_json::Value;
use std::sync::Arc;

#[derive(Clone)]
struct ProviderPassthroughRuntime {
    client: PassthroughClient,
    providers: Arc<Vec<ProviderPassthroughTarget>>,
    adapter: Option<ProviderNativeAdapterRuntime>,
}

#[derive(Clone)]
struct ProviderNativeAdapterRuntime {
    registry: Arc<ProviderAdapterRegistry>,
    client: ProviderAdapterHttpClient,
}

const PROVIDER_NATIVE_PASSTHROUGH_PROVIDERS: &[&str] = &[
    "openai",
    "google",
    "anthropic",
    "volcengine",
    "tencent-cloud",
    "tencent-hunyuan",
    "alicloud",
    "aliyun",
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

pub fn router_with_provider_passthrough_and_adapter_config(
    config: ProviderRelayConfig,
    adapter_config: Option<ProviderAdapterConfig>,
) -> Router {
    provider_passthrough_router_with_runtime(ProviderPassthroughRuntime::from_config_with_adapter(
        config,
        adapter_config,
    ))
}

pub fn authenticated_gateway_passthrough_router_with_adapter_config<C>(
    config: ProviderRelayConfig,
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    adapter_config: Option<ProviderAdapterConfig>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let runtime = ProviderPassthroughRuntime::from_config_with_adapter(config, adapter_config);
    let state = AuthenticatedProviderPassthroughState {
        runtime,
        catalog,
        api_key_hasher,
        secret_resolver: None,
    };
    let openai_router = if state.runtime.has_openai_target() {
        authenticated_openai_passthrough_router::<C>(state.clone())
    } else {
        openai_passthrough_placeholder_router()
    };
    openai_router.merge(authenticated_provider_passthrough_router::<C>(state))
}

pub fn authenticated_provider_native_passthrough_router_with_adapter_config<C>(
    config: Option<ProviderRelayConfig>,
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    adapter_config: Option<ProviderAdapterConfig>,
    secret_resolver: Option<Arc<dyn ProviderSecretResolver + Send + Sync>>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    authenticated_provider_passthrough_router::<C>(AuthenticatedProviderPassthroughState {
        runtime: ProviderPassthroughRuntime::from_optional_config_with_adapter(
            config,
            adapter_config,
        ),
        catalog,
        api_key_hasher,
        secret_resolver,
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
        secret_resolver: None,
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
    match runtime.forward(request, None).await {
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
    let context = match authenticate_passthrough_api_key(&state, &headers, &uri) {
        Ok(context) => context,
        Err(response) => return response,
    };
    let result = match state.secret_resolver.as_ref() {
        Some(secret_resolver) => {
            state
                .runtime
                .forward_with_account_pool(
                    state.catalog.as_ref(),
                    secret_resolver.as_ref(),
                    request,
                    &context,
                )
                .await
        }
        None => state.runtime.forward(request, Some(&context)).await,
    };
    match result {
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
    secret_resolver: Option<Arc<dyn ProviderSecretResolver + Send + Sync>>,
}

impl<C> Clone for AuthenticatedProviderPassthroughState<C> {
    fn clone(&self) -> Self {
        Self {
            runtime: self.runtime.clone(),
            catalog: Arc::clone(&self.catalog),
            api_key_hasher: Arc::clone(&self.api_key_hasher),
            secret_resolver: self.secret_resolver.clone(),
        }
    }
}

fn authenticate_passthrough_api_key<C>(
    state: &AuthenticatedProviderPassthroughState<C>,
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

impl ProviderPassthroughRuntime {
    fn from_config(config: ProviderRelayConfig) -> Self {
        Self::from_config_with_adapter(config, None)
    }

    fn from_config_with_adapter(
        config: ProviderRelayConfig,
        adapter_config: Option<ProviderAdapterConfig>,
    ) -> Self {
        Self::from_optional_config_with_adapter(Some(config), adapter_config)
    }

    fn from_optional_config_with_adapter(
        config: Option<ProviderRelayConfig>,
        adapter_config: Option<ProviderAdapterConfig>,
    ) -> Self {
        let openai_target = config
            .as_ref()
            .and_then(ProviderRelayConfig::openai_relay)
            .map(|relay| {
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
                    .chain(
                        config
                            .as_ref()
                            .into_iter()
                            .flat_map(ProviderRelayConfig::provider_passthrough_targets)
                            .map(|target| {
                                ProviderPassthroughTarget::new(
                                    target.provider(),
                                    target.base_url().trim_end_matches('/').to_owned(),
                                    target.auth().clone(),
                                    target.default_headers().to_vec(),
                                )
                            }),
                    )
                    .collect(),
            ),
            adapter: adapter_config
                .filter(|config| !config.routes().is_empty())
                .map(|config| ProviderNativeAdapterRuntime {
                    registry: Arc::new(ProviderAdapterRegistry::new(config.routes().to_vec())),
                    client: ProviderAdapterHttpClient::new(config.gateway_token().to_owned()),
                }),
        }
    }

    async fn forward(
        &self,
        request: Request,
        context: Option<&AuthenticatedApiKeyContext>,
    ) -> Result<Response, String> {
        let target = self
            .target_for_path(request.uri().path())
            .ok_or_else(|| "provider passthrough target is not configured".to_owned())?;
        let standard_path = standard_path_from_passthrough_uri(request.uri())?;
        if let Some(adapter) = &self.adapter {
            let lookup = ProviderAdapterLookup {
                provider_code: target.provider(),
                method: request.method().as_str(),
                standard_path: standard_path.as_str(),
                capability: None,
                endpoint_key: None,
            };
            if let ProviderInvocationMode::InternalHttpAdapter(route) =
                adapter.registry.resolve_standard_path(&lookup).mode
            {
                return self
                    .forward_to_adapter(
                        request,
                        context,
                        target,
                        adapter,
                        route,
                        standard_path,
                        0,
                        None,
                    )
                    .await;
            }
        }
        let upstream_uri = build_provider_passthrough_uri(target, request.uri())?;
        self.forward_to_target(request, target, upstream_uri).await
    }

    async fn forward_with_account_pool<C>(
        &self,
        catalog: &C,
        secret_resolver: &(dyn ProviderSecretResolver + Send + Sync),
        request: Request,
        context: &AuthenticatedApiKeyContext,
    ) -> Result<Response, String>
    where
        C: PricingCatalog + Send + Sync + 'static,
    {
        if self.target_for_path(request.uri().path()).is_some() {
            return self.forward(request, Some(context)).await;
        }

        let adapter = self
            .adapter
            .as_ref()
            .ok_or_else(|| "provider passthrough target is not configured".to_owned())?;
        let standard_path = standard_path_from_passthrough_uri(request.uri())?;
        let metadata_route = adapter
            .registry
            .resolve_standard_path_metadata(request.method().as_str(), standard_path.as_str())
            .ok_or_else(|| "provider passthrough target is not configured".to_owned())?;
        let account_route =
            select_provider_native_account_pool_route(catalog, context, &metadata_route)?;
        let target = account_pool_route_to_passthrough_target(&account_route, secret_resolver)?;
        let final_resolution = adapter
            .registry
            .resolve_standard_path(&ProviderAdapterLookup {
                provider_code: account_route.provider_code.as_str(),
                method: request.method().as_str(),
                standard_path: standard_path.as_str(),
                capability: metadata_route.capability.as_deref(),
                endpoint_key: metadata_route.endpoint_key.as_deref(),
            });
        match final_resolution.mode {
            ProviderInvocationMode::InternalHttpAdapter(route) => {
                self.forward_to_adapter(
                    request,
                    Some(context),
                    &target,
                    adapter,
                    route,
                    standard_path,
                    account_route.channel_id,
                    account_route.timeout_ms,
                )
                .await
            }
            ProviderInvocationMode::DirectHttp => {
                let upstream_uri = build_provider_passthrough_uri(&target, request.uri())?;
                self.forward_to_target(request, &target, upstream_uri).await
            }
        }
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

    async fn forward_to_adapter(
        &self,
        request: Request,
        context: Option<&AuthenticatedApiKeyContext>,
        target: &ProviderPassthroughTarget,
        adapter: &ProviderNativeAdapterRuntime,
        route: ProviderAdapterRouteConfig,
        standard_path: String,
        channel_id: i64,
        timeout_ms: Option<u64>,
    ) -> Result<Response, String> {
        let (parts, body) = request.into_parts();
        let body = body
            .collect()
            .await
            .map_err(|error| format!("failed to read provider adapter body: {error}"))?
            .to_bytes();
        let request_body = provider_adapter_request_body(&body)?;
        let invocation = build_provider_native_adapter_invocation(
            &parts,
            target,
            &route,
            standard_path,
            context,
            request_body,
            channel_id,
            timeout_ms,
        );
        let response = adapter
            .client
            .invoke(&route, invocation)
            .await
            .map_err(provider_adapter_http_error)?;
        adapter_invocation_response(response)
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

fn standard_path_from_passthrough_uri(original_uri: &Uri) -> Result<String, String> {
    let (provider, provider_path) = split_provider_passthrough_path(original_uri.path())
        .ok_or_else(|| "provider passthrough path is invalid".to_owned())?;
    if is_standard_path_namespace(provider) {
        Ok(format!("/{provider}/{provider_path}"))
    } else {
        Ok(format!("/{provider_path}"))
    }
}

fn provider_adapter_request_body(body: &[u8]) -> Result<Value, String> {
    if body.is_empty() {
        return Ok(Value::Null);
    }
    serde_json::from_slice(body)
        .map_err(|error| format!("provider adapter route requires a JSON request body: {error}"))
}

fn select_provider_native_account_pool_route<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    adapter_route: &ProviderAdapterRouteConfig,
) -> Result<ProviderAccountPoolRoute, String>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let route_key = adapter_route.endpoint_key.clone().unwrap_or_else(|| {
        endpoint_key_from_standard_path(
            adapter_route.provider_code.as_str(),
            adapter_route.standard_path_pattern.as_str(),
        )
    });
    let capability = adapter_route
        .capability
        .as_deref()
        .and_then(provider_native_routing_capability)
        .ok_or_else(|| {
            format!("provider native adapter route {route_key} requires a known routing capability")
        })?;
    ProviderRouteSelector::new(catalog)
        .select_account_pool(SelectProviderAccountPoolRouteQuery {
            context: context.clone(),
            route_key,
            capability,
        })
        .map(|selection| selection.route)
        .map_err(|error| error.to_string())
}

fn account_pool_route_to_passthrough_target(
    route: &ProviderAccountPoolRoute,
    secret_resolver: &(dyn ProviderSecretResolver + Send + Sync),
) -> Result<ProviderPassthroughTarget, String> {
    let base_url = route.base_url.as_deref().ok_or_else(|| {
        format!(
            "provider route is not available for configured account pool: selected channel {} has no base URL",
            route.channel_id
        )
    })?;
    let secret_ref = route.secret_ref.as_deref().ok_or_else(|| {
        format!(
            "provider route is not available for configured account pool: selected channel {} has no secret_ref",
            route.channel_id
        )
    })?;
    let secret_value = secret_resolver
        .resolve_secret_value(secret_ref)
        .map_err(|error| {
            format!("provider route is not available for configured account pool: {error}")
        })?;
    let rendered_auth = render_provider_account_auth(&route.auth_profile, secret_value)?;
    Ok(ProviderPassthroughTarget::new(
        route.provider_code.clone(),
        base_url.trim_end_matches('/').to_owned(),
        rendered_auth.auth,
        rendered_auth.default_headers,
    ))
}

fn provider_native_routing_capability(value: &str) -> Option<RoutingCapability> {
    match value.trim().to_ascii_lowercase().as_str() {
        "chat" | "llm" | "text" => Some(RoutingCapability::Chat),
        "image" | "image_generation" => Some(RoutingCapability::Image),
        "audio" => Some(RoutingCapability::Audio),
        "music" | "music_generation" => Some(RoutingCapability::Music),
        "video" | "video_generation" => Some(RoutingCapability::Video),
        "embedding" | "embeddings" => Some(RoutingCapability::Embedding),
        "rerank" => Some(RoutingCapability::Rerank),
        "network" => Some(RoutingCapability::Network),
        _ => None,
    }
}

fn build_provider_native_adapter_invocation(
    parts: &axum::http::request::Parts,
    target: &ProviderPassthroughTarget,
    route: &ProviderAdapterRouteConfig,
    standard_path: String,
    context: Option<&AuthenticatedApiKeyContext>,
    request_body: Value,
    channel_id: i64,
    timeout_ms: Option<u64>,
) -> AdapterInvocationRequest {
    let endpoint_key = route
        .endpoint_key
        .clone()
        .unwrap_or_else(|| endpoint_key_from_standard_path(target.provider(), &standard_path));
    let provider_model = provider_model_from_body(&request_body, target.provider());
    AdapterInvocationRequest {
        invocation: AdapterInvocationMetadata {
            id: adapter_invocation_id(target.provider(), parts.method.as_str(), &endpoint_key),
            endpoint_key,
            method: parts.method.as_str().to_ascii_uppercase(),
            standard_path,
            shape: route.invocation_shape.clone(),
            stream: adapter_invocation_shape_streams(&route.invocation_shape),
            request_id: request_header_value(&parts.headers, "x-request-id"),
            trace_id: request_header_value(&parts.headers, "x-trace-id")
                .or_else(|| request_header_value(&parts.headers, "traceparent")),
        },
        subject: adapter_subject(context),
        provider: AdapterProviderContext {
            provider_code: target.provider().to_owned(),
            channel_id,
            provider_model,
            base_url: Some(target.base_url().to_owned()),
            auth_profile: provider_passthrough_auth_profile_json(target),
            timeout_ms,
        },
        secret: AdapterSecret::GatewayResolved(provider_passthrough_secret_json(target)),
        body: request_body,
    }
}

fn adapter_subject(context: Option<&AuthenticatedApiKeyContext>) -> AdapterSubject {
    match context {
        Some(context) => AdapterSubject {
            tenant_id: context.tenant_id,
            organization_id: context.organization_id,
            user_id: context.user_id,
            api_key_id: context.api_key_id,
            group_id: context.group_id,
            group_code: context.group_code.clone(),
            pricing_plan_code: context.pricing_plan_code.clone(),
        },
        None => AdapterSubject {
            tenant_id: 0,
            organization_id: 0,
            user_id: 0,
            api_key_id: 0,
            group_id: 0,
            group_code: "provider-passthrough".to_owned(),
            pricing_plan_code: "gateway".to_owned(),
        },
    }
}

fn provider_passthrough_auth_profile_json(target: &ProviderPassthroughTarget) -> Value {
    json!({
        "type": provider_passthrough_auth_type(target.auth().auth_type()),
        "name": target.auth().name(),
        "defaultHeaders": target.default_headers().iter().map(|header| {
            json!({
                "name": header.name(),
                "value": header.value(),
            })
        }).collect::<Vec<_>>(),
    })
}

fn provider_passthrough_secret_json(target: &ProviderPassthroughTarget) -> Value {
    json!({
        "auth": {
            "type": provider_passthrough_auth_type(target.auth().auth_type()),
            "name": target.auth().name(),
            "value": target.auth().value(),
        },
        "defaultHeaders": target.default_headers().iter().map(|header| {
            json!({
                "name": header.name(),
                "value": header.value(),
            })
        }).collect::<Vec<_>>(),
    })
}

fn provider_passthrough_auth_type(auth_type: ProviderPassthroughAuthType) -> &'static str {
    match auth_type {
        ProviderPassthroughAuthType::Bearer => "bearer",
        ProviderPassthroughAuthType::Header => "header",
        ProviderPassthroughAuthType::Query => "query",
    }
}

fn adapter_invocation_shape_streams(shape: &AdapterInvocationShape) -> bool {
    matches!(
        shape,
        AdapterInvocationShape::SseStream | AdapterInvocationShape::ByteStream
    )
}

fn endpoint_key_from_standard_path(provider: &str, standard_path: &str) -> String {
    let suffix = standard_path
        .trim_matches('/')
        .chars()
        .map(|character| {
            if matches!(character, '/' | '-') {
                '.'
            } else {
                character
            }
        })
        .collect::<String>()
        .trim_matches('.')
        .to_owned();
    if suffix.is_empty() {
        format!("{provider}.unknown")
    } else {
        suffix
    }
}

fn provider_model_from_body(body: &Value, fallback: &str) -> String {
    body.get("model")
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .unwrap_or(fallback)
        .to_owned()
}

fn adapter_invocation_id(provider: &str, method: &str, endpoint_key: &str) -> String {
    format!(
        "provider-native-{}-{}-{}",
        provider.trim(),
        method.trim().to_ascii_lowercase(),
        endpoint_key
            .trim()
            .chars()
            .map(|character| {
                if matches!(character, '/' | ' ' | ':') {
                    '.'
                } else {
                    character
                }
            })
            .collect::<String>()
    )
}

fn request_header_value(headers: &HeaderMap, name: &str) -> Option<String> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
}

fn provider_adapter_http_error(error: ProviderAdapterHttpError) -> String {
    let status = error
        .status_code
        .map(|status_code| format!(" HTTP {status_code}"))
        .unwrap_or_default();
    format!(
        "provider adapter invocation failed{status}: {}",
        error.message
    )
}

fn adapter_invocation_response(response: AdapterInvocationResponse) -> Result<Response, String> {
    let status = StatusCode::from_u16(response.status_code)
        .map_err(|error| format!("provider adapter returned invalid status code: {error}"))?;
    let mut builder = Response::builder().status(status);
    let mut has_content_type = false;
    for (name, value) in response.headers {
        if !should_forward_adapter_response_header(name.as_str()) {
            continue;
        }
        let header_name = HeaderName::from_bytes(name.as_bytes()).map_err(|error| {
            format!("provider adapter returned invalid response header name {name}: {error}")
        })?;
        let header_value = HeaderValue::from_str(value.as_str()).map_err(|error| {
            format!("provider adapter returned invalid response header value for {name}: {error}")
        })?;
        if header_name == axum::http::header::CONTENT_TYPE {
            has_content_type = true;
        }
        builder = builder.header(header_name, header_value);
    }
    if !has_content_type {
        builder = builder.header(axum::http::header::CONTENT_TYPE, "application/json");
    }
    let body = serde_json::to_vec(&response.body)
        .map_err(|error| format!("failed to serialize provider adapter response body: {error}"))?;
    builder
        .body(Body::from(body))
        .map_err(|error| format!("failed to build provider adapter response: {error}"))
}

fn should_forward_adapter_response_header(name: &str) -> bool {
    !matches!(
        name.to_ascii_lowercase().as_str(),
        "connection"
            | "keep-alive"
            | "proxy-authenticate"
            | "proxy-authorization"
            | "te"
            | "trailer"
            | "transfer-encoding"
            | "upgrade"
            | "content-length"
    )
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

fn is_standard_path_namespace(value: &str) -> bool {
    matches!(
        value,
        "openai"
            | "v1"
            | "google"
            | "anthropic"
            | "volcengine"
            | "suno"
            | "midjourney"
            | "kling"
            | "vidu"
            | "nano-banana"
    )
}
