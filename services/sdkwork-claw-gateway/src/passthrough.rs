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
use crate::request_identity::generate_server_request_id;
use axum::body::Body;
use axum::extract::Request;
use axum::extract::State;
use axum::http::header::{HeaderName, HeaderValue, USER_AGENT};
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
use sdkwork_claw_product::api::normalize_user_agent_header;
use sdkwork_claw_product::application::{
    ApiKeySecretHasher, AuthenticatedApiKeyContext, PricingResolver, ProviderRouteSelector,
    ResolveModelPriceQuery, SelectProviderChannelRouteQuery,
};
use sdkwork_claw_product::domain::{
    provider_native_model_id, BillingMeter, DecimalValue, DomainError, DomainResult,
    ProviderChannelRoute, RoutingCapability,
};
use sdkwork_claw_product::ports::{
    GatewayUsageQuantity, GatewayUsageRecordCommand, GatewayUsageRecorder, PricingCatalog,
    ProviderSecretResolver,
};
use sdkwork_claw_provider_adapter_contract::{
    AdapterInvocationMetadata, AdapterInvocationRequest, AdapterInvocationResponse,
    AdapterInvocationShape, AdapterProviderContext, AdapterSecret, AdapterSubject,
    AdapterUsageLine,
};
use sdkwork_claw_provider_adapter_http::{ProviderAdapterHttpClient, ProviderAdapterHttpError};
use sdkwork_claw_provider_adapter_registry::{
    ProviderAdapterLookup, ProviderAdapterRegistry, ProviderAdapterRouteConfig,
    ProviderInvocationMode,
};
use serde_json::json;
use serde_json::Value;
use std::sync::Arc;

type UsageRecorder = Arc<dyn GatewayUsageRecorder + Send + Sync>;

const ADAPTER_USAGE_TYPE_BASE: i64 = 10_000;
const TOKEN_BILLING_UNIT_SIZE_DECIMAL: &str = "1000000";
const USAGE_AMOUNT_DECIMAL_DIGITS: u32 = 12;
const MODALITY_TEXT: i64 = 1;
const MODALITY_IMAGE: i64 = 2;
const MODALITY_AUDIO: i64 = 3;
const MODALITY_MUSIC: i64 = 4;
const MODALITY_VIDEO: i64 = 5;
const MODALITY_EMBEDDING: i64 = 6;
const MODALITY_RERANK: i64 = 7;

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
    "elevenlabs",
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
    usage_recorder: Option<UsageRecorder>,
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
        usage_recorder,
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
    usage_recorder: Option<UsageRecorder>,
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
        usage_recorder,
    })
}

pub fn route_scoped_openai_passthrough_router<C>(
    catalog: Arc<C>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    secret_resolver: Arc<dyn ProviderSecretResolver + Send + Sync>,
    usage_recorder: Option<UsageRecorder>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    crate::route_scoped_openai_passthrough::router(
        catalog,
        api_key_hasher,
        secret_resolver,
        usage_recorder,
    )
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
        usage_recorder: None,
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
                .forward_with_channel_route(
                    state.catalog.as_ref(),
                    secret_resolver.as_ref(),
                    request,
                    &context,
                    state.usage_recorder.as_ref(),
                )
                .await
        }
        None => {
            state
                .runtime
                .forward_authenticated(
                    state.catalog.as_ref(),
                    request,
                    &context,
                    state.usage_recorder.as_ref(),
                )
                .await
        }
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
    usage_recorder: Option<UsageRecorder>,
}

impl<C> Clone for AuthenticatedProviderPassthroughState<C> {
    fn clone(&self) -> Self {
        Self {
            runtime: self.runtime.clone(),
            catalog: Arc::clone(&self.catalog),
            api_key_hasher: Arc::clone(&self.api_key_hasher),
            secret_resolver: self.secret_resolver.clone(),
            usage_recorder: self.usage_recorder.clone(),
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
                let (_, response, _) = self
                    .invoke_adapter(
                        request,
                        context,
                        target,
                        adapter,
                        route,
                        standard_path,
                        0,
                        None,
                    )
                    .await?;
                return adapter_invocation_response(response);
            }
        }
        let upstream_uri = build_provider_passthrough_uri(target, request.uri())?;
        self.forward_to_target(request, target, upstream_uri).await
    }

    async fn forward_authenticated<C>(
        &self,
        catalog: &C,
        request: Request,
        context: &AuthenticatedApiKeyContext,
        usage_recorder: Option<&UsageRecorder>,
    ) -> Result<Response, String>
    where
        C: PricingCatalog + Send + Sync + 'static,
    {
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
                let (invocation, response, user_agent) = self
                    .invoke_adapter(
                        request,
                        Some(context),
                        target,
                        adapter,
                        route,
                        standard_path,
                        0,
                        None,
                    )
                    .await?;
                record_adapter_usage_lines(
                    catalog,
                    usage_recorder,
                    context,
                    &invocation,
                    &response,
                    user_agent.as_deref(),
                )
                .await?;
                return adapter_invocation_response(response);
            }
        }
        let upstream_uri = build_provider_passthrough_uri(target, request.uri())?;
        self.forward_to_target(request, target, upstream_uri).await
    }

    async fn forward_with_channel_route<C>(
        &self,
        catalog: &C,
        secret_resolver: &(dyn ProviderSecretResolver + Send + Sync),
        request: Request,
        context: &AuthenticatedApiKeyContext,
        usage_recorder: Option<&UsageRecorder>,
    ) -> Result<Response, String>
    where
        C: PricingCatalog + Send + Sync + 'static,
    {
        if self.target_for_path(request.uri().path()).is_some() {
            return self
                .forward_authenticated(catalog, request, context, usage_recorder)
                .await;
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
            select_provider_native_channel_route(catalog, context, &metadata_route)?;
        let target = channel_route_to_passthrough_target(&account_route, secret_resolver)?;
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
                let (invocation, response, user_agent) = self
                    .invoke_adapter(
                        request,
                        Some(context),
                        &target,
                        adapter,
                        route,
                        standard_path,
                        account_route.channel_id,
                        account_route.timeout_ms,
                    )
                    .await?;
                record_adapter_usage_lines(
                    catalog,
                    usage_recorder,
                    context,
                    &invocation,
                    &response,
                    user_agent.as_deref(),
                )
                .await?;
                adapter_invocation_response(response)
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

    async fn invoke_adapter(
        &self,
        request: Request,
        context: Option<&AuthenticatedApiKeyContext>,
        target: &ProviderPassthroughTarget,
        adapter: &ProviderNativeAdapterRuntime,
        route: ProviderAdapterRouteConfig,
        standard_path: String,
        channel_id: i64,
        timeout_ms: Option<u64>,
    ) -> Result<
        (
            AdapterInvocationRequest,
            AdapterInvocationResponse,
            Option<String>,
        ),
        String,
    > {
        let (parts, body) = request.into_parts();
        let user_agent = request_header_value(&parts.headers, USER_AGENT.as_str())
            .and_then(|value| normalize_user_agent_header(value.as_str()));
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
            .invoke(&route, invocation.clone())
            .await
            .map_err(provider_adapter_http_error)?;
        Ok((invocation, response, user_agent))
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

async fn record_adapter_usage_lines<C>(
    catalog: &C,
    usage_recorder: Option<&UsageRecorder>,
    context: &AuthenticatedApiKeyContext,
    invocation: &AdapterInvocationRequest,
    response: &AdapterInvocationResponse,
    user_agent: Option<&str>,
) -> Result<(), String>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let Some(usage_recorder) = usage_recorder else {
        return Ok(());
    };
    if !(200..=299).contains(&response.status_code) || response.usage.usage_lines.is_empty() {
        return Ok(());
    }
    let commands = response
        .usage
        .usage_lines
        .iter()
        .enumerate()
        .map(|(line_index, usage_line)| {
            adapter_usage_line_command(
                catalog, context, invocation, response, usage_line, line_index, user_agent,
            )
            .map_err(|error| {
                format!(
                    "provider adapter usage recording failed for meter {}: {error}",
                    usage_line.meter_code
                )
            })
        })
        .collect::<Result<Vec<_>, _>>()?;
    for command in commands {
        let meter_code = command.billing_meter_code.clone();
        usage_recorder
            .record_gateway_usage(command)
            .await
            .map_err(|error| {
                format!("provider adapter usage recording failed for meter {meter_code}: {error}")
            })?;
    }
    Ok(())
}

fn adapter_usage_line_command<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    invocation: &AdapterInvocationRequest,
    response: &AdapterInvocationResponse,
    usage_line: &AdapterUsageLine,
    line_index: usize,
    user_agent: Option<&str>,
) -> DomainResult<GatewayUsageRecordCommand>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let meter_code = usage_line.meter_code.trim();
    if meter_code.is_empty() {
        return Err(DomainError::new(
            "adapter usage line meter_code is required",
        ));
    }
    let billing_meter = BillingMeter::from_code(meter_code);
    if billing_meter == BillingMeter::Unknown {
        return Err(DomainError::new(format!(
            "adapter usage line meter_code is not supported: {meter_code}"
        )));
    }

    let quantity = GatewayUsageQuantity::for_meter(
        billing_meter.clone(),
        usage_line.billable_quantity.as_str(),
    )?;
    let requested_model_catalog_key = adapter_requested_model_catalog_key(invocation, usage_line);
    let catalog_key = canonical_adapter_usage_catalog_key(&requested_model_catalog_key);
    let provider_native_model = usage_line
        .provider_native_model
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
        .unwrap_or_else(|| provider_native_model_id(&invocation.provider.provider_model));
    let requested_model = provider_native_model.clone();
    let price = PricingResolver::new(catalog).resolve(ResolveModelPriceQuery {
        api_key_id: context.api_key_id,
        model: catalog_key.clone(),
        billing_meter: billing_meter.clone(),
        provider_code: Some(invocation.provider.provider_code.clone()),
        channel_id: Some(invocation.provider.channel_id),
    })?;
    let official_reference_amount = adapter_meter_amount(
        price.official_reference.unit_price.unit_price,
        quantity.billable_quantity.as_str(),
        &billing_meter,
    )?;
    let upstream_cost_amount = match price.upstream_cost.as_ref() {
        Some(upstream) => adapter_meter_amount(
            upstream.unit_price.unit_price,
            quantity.billable_quantity.as_str(),
            &billing_meter,
        )?,
        None => DecimalValue::ZERO,
    };
    let customer_charge_amount = adapter_meter_amount(
        price.customer_charge.unit_price,
        quantity.billable_quantity.as_str(),
        &billing_meter,
    )?;
    let token_counts = adapter_token_counts(&billing_meter, quantity.billable_quantity.as_str())?;
    let pricing_snapshot = adapter_usage_pricing_snapshot(
        invocation,
        usage_line,
        line_index,
        &catalog_key,
        &requested_model_catalog_key,
        &requested_model,
        &provider_native_model,
        &billing_meter,
        &price,
    );

    Ok(GatewayUsageRecordCommand {
        request_id: invocation
            .invocation
            .request_id
            .clone()
            .unwrap_or_else(generate_server_request_id),
        trace_id: invocation.invocation.trace_id.clone(),
        tenant_id: context.tenant_id,
        organization_id: context.organization_id,
        user_id: context.user_id,
        api_key_id: context.api_key_id,
        api_key_name_snapshot: context.api_key_name_snapshot.clone(),
        channel_group_id: context.group_id,
        channel_group_snapshot: context.group_code.clone(),
        catalog_key,
        requested_model,
        requested_model_catalog_key,
        provider_code: invocation.provider.provider_code.clone(),
        channel_id: invocation.provider.channel_id,
        provider_model: provider_native_model.clone(),
        provider_native_model,
        request_path: invocation.invocation.standard_path.clone(),
        http_method: invocation.invocation.method.clone(),
        user_agent: user_agent.map(str::to_owned),
        http_status: response.status_code,
        streaming: invocation.invocation.stream,
        modality: adapter_modality_for_usage_line(invocation, &billing_meter),
        usage_type: adapter_usage_type_for_line(&billing_meter, line_index),
        billing_meter_code: billing_meter.code().to_owned(),
        billable_quantity: quantity.billable_quantity,
        prompt_tokens: token_counts.prompt_tokens,
        completion_tokens: token_counts.completion_tokens,
        cached_tokens: token_counts.cached_tokens,
        total_tokens: token_counts.total_tokens,
        request_count: quantity.request_count,
        result_count: quantity.result_count,
        item_count: quantity.item_count,
        character_count: quantity.character_count,
        image_count: quantity.image_count,
        audio_seconds: quantity.audio_seconds,
        video_seconds: quantity.video_seconds,
        latency_ms: None,
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

fn adapter_requested_model_catalog_key(
    invocation: &AdapterInvocationRequest,
    usage_line: &AdapterUsageLine,
) -> String {
    if let Some(catalog_key) = usage_line
        .requested_model_catalog_key
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
    {
        return catalog_key.to_owned();
    }
    let provider_model = invocation.provider.provider_model.trim();
    if provider_model
        .split('/')
        .filter(|part| !part.is_empty())
        .count()
        >= 2
    {
        return provider_model.to_owned();
    }
    format!(
        "{}/global/{}",
        invocation.provider.provider_code.trim(),
        provider_model
    )
}

fn canonical_adapter_usage_catalog_key(requested_model_catalog_key: &str) -> String {
    let parts = requested_model_catalog_key
        .trim()
        .split('/')
        .map(str::trim)
        .filter(|part| !part.is_empty())
        .collect::<Vec<_>>();
    match parts.as_slice() {
        [vendor, region, model @ ..] if !model.is_empty() && known_region_segment(region) => {
            format!("{}/{}", vendor, model.join("/"))
        }
        _ => requested_model_catalog_key.trim().to_owned(),
    }
}

fn known_region_segment(value: &str) -> bool {
    matches!(
        value.trim().to_ascii_lowercase().as_str(),
        "global"
            | "cn"
            | "us"
            | "eu"
            | "ap"
            | "apac"
            | "jp"
            | "sg"
            | "hk"
            | "aws"
            | "azure"
            | "gcp"
            | "local"
    )
}

fn adapter_meter_amount(
    unit_price: DecimalValue,
    billable_quantity: &str,
    billing_meter: &BillingMeter,
) -> DomainResult<DecimalValue> {
    let amount = unit_price.checked_multiply(DecimalValue::parse(billable_quantity)?)?;
    if adapter_meter_uses_million_token_unit(billing_meter) {
        amount.checked_divide(DecimalValue::parse(TOKEN_BILLING_UNIT_SIZE_DECIMAL)?)
    } else {
        Ok(amount)
    }
}

fn adapter_meter_uses_million_token_unit(billing_meter: &BillingMeter) -> bool {
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

#[derive(Debug, Clone, Copy)]
struct AdapterTokenCounts {
    prompt_tokens: i64,
    completion_tokens: i64,
    cached_tokens: i64,
    total_tokens: i64,
}

fn adapter_token_counts(
    billing_meter: &BillingMeter,
    billable_quantity: &str,
) -> DomainResult<AdapterTokenCounts> {
    if !adapter_meter_uses_million_token_unit(billing_meter) {
        return Ok(AdapterTokenCounts {
            prompt_tokens: 0,
            completion_tokens: 0,
            cached_tokens: 0,
            total_tokens: 0,
        });
    }
    let tokens = billable_quantity.trim().parse::<i64>().map_err(|_| {
        DomainError::new(format!(
            "token usage line quantity must be an integer: {billable_quantity}"
        ))
    })?;
    match billing_meter {
        BillingMeter::LlmInputToken
        | BillingMeter::EmbeddingInputToken
        | BillingMeter::AudioInputToken
        | BillingMeter::ImageInputToken
        | BillingMeter::VideoInputToken => Ok(AdapterTokenCounts {
            prompt_tokens: tokens,
            completion_tokens: 0,
            cached_tokens: 0,
            total_tokens: tokens,
        }),
        BillingMeter::LlmCacheWriteToken | BillingMeter::LlmCacheReadToken => {
            Ok(AdapterTokenCounts {
                prompt_tokens: 0,
                completion_tokens: 0,
                cached_tokens: tokens,
                total_tokens: tokens,
            })
        }
        _ => Ok(AdapterTokenCounts {
            prompt_tokens: 0,
            completion_tokens: tokens,
            cached_tokens: 0,
            total_tokens: tokens,
        }),
    }
}

fn adapter_modality_for_usage_line(
    invocation: &AdapterInvocationRequest,
    billing_meter: &BillingMeter,
) -> i64 {
    match billing_meter {
        BillingMeter::ApiRequest
        | BillingMeter::ApiResult
        | BillingMeter::ApiItem
        | BillingMeter::ToolCall
        | BillingMeter::WebSearchCall
        | BillingMeter::FileSearchCall
        | BillingMeter::CodeInterpreterSession
        | BillingMeter::ContainerSession => adapter_modality_from_invocation(invocation)
            .unwrap_or_else(|| adapter_modality_for_meter(billing_meter)),
        _ => adapter_modality_for_meter(billing_meter),
    }
}

fn adapter_modality_from_invocation(invocation: &AdapterInvocationRequest) -> Option<i64> {
    let value = format!(
        "{} {}",
        invocation.invocation.endpoint_key, invocation.invocation.standard_path
    )
    .to_ascii_lowercase();
    if value.contains("embedding") || value.contains("embeddings") {
        return Some(MODALITY_EMBEDDING);
    }
    if value.contains("rerank") || value.contains("ranking") {
        return Some(MODALITY_RERANK);
    }
    if value.contains("video") || value.contains("vidu") || value.contains("kling") {
        return Some(MODALITY_VIDEO);
    }
    if value.contains("image") || value.contains("images") {
        return Some(MODALITY_IMAGE);
    }
    if value.contains("music") || value.contains("sfx") || value.contains("sound") {
        return Some(MODALITY_MUSIC);
    }
    if value.contains("audio")
        || value.contains("speech")
        || value.contains("voice")
        || value.contains("transcription")
    {
        return Some(MODALITY_AUDIO);
    }
    None
}

fn adapter_modality_for_meter(billing_meter: &BillingMeter) -> i64 {
    match billing_meter {
        BillingMeter::EmbeddingInputToken | BillingMeter::EmbeddingImage => MODALITY_EMBEDDING,
        BillingMeter::ImageInputToken
        | BillingMeter::ImageOutputToken
        | BillingMeter::ImageResult
        | BillingMeter::ImagePixel
        | BillingMeter::ImageMegapixel => MODALITY_IMAGE,
        BillingMeter::AudioInputToken
        | BillingMeter::AudioOutputToken
        | BillingMeter::AudioInputSecond
        | BillingMeter::AudioOutputSecond
        | BillingMeter::AudioInputMinute
        | BillingMeter::AudioOutputMinute
        | BillingMeter::TtsInputCharacter
        | BillingMeter::SpeechCharacter
        | BillingMeter::SttAudioMinute => MODALITY_AUDIO,
        BillingMeter::MusicOutputSecond | BillingMeter::SfxResult => MODALITY_MUSIC,
        BillingMeter::VideoInputToken
        | BillingMeter::VideoOutputToken
        | BillingMeter::VideoInputSecond
        | BillingMeter::VideoOutputSecond
        | BillingMeter::VideoResult => MODALITY_VIDEO,
        BillingMeter::RerankSearch | BillingMeter::RerankDocument => MODALITY_RERANK,
        _ => MODALITY_TEXT,
    }
}

fn adapter_usage_type_for_line(billing_meter: &BillingMeter, line_index: usize) -> i64 {
    ADAPTER_USAGE_TYPE_BASE + adapter_billing_meter_ordinal(billing_meter) * 100 + line_index as i64
}

fn adapter_billing_meter_ordinal(billing_meter: &BillingMeter) -> i64 {
    match billing_meter {
        BillingMeter::LlmInputToken => 1,
        BillingMeter::LlmOutputToken => 2,
        BillingMeter::LlmReasoningToken => 3,
        BillingMeter::LlmCacheWriteToken => 4,
        BillingMeter::LlmCacheReadToken => 5,
        BillingMeter::LlmCacheStorageTokenHour => 6,
        BillingMeter::EmbeddingInputToken => 7,
        BillingMeter::EmbeddingImage => 8,
        BillingMeter::ImageInputToken => 9,
        BillingMeter::ImageOutputToken => 10,
        BillingMeter::ImageResult => 11,
        BillingMeter::ImagePixel => 12,
        BillingMeter::ImageMegapixel => 13,
        BillingMeter::AudioInputToken => 14,
        BillingMeter::AudioOutputToken => 15,
        BillingMeter::AudioInputSecond => 16,
        BillingMeter::AudioOutputSecond => 17,
        BillingMeter::AudioInputMinute => 18,
        BillingMeter::AudioOutputMinute => 19,
        BillingMeter::TtsInputCharacter => 20,
        BillingMeter::SpeechCharacter => 21,
        BillingMeter::SttAudioMinute => 22,
        BillingMeter::VideoInputToken => 23,
        BillingMeter::VideoOutputToken => 24,
        BillingMeter::VideoInputSecond => 25,
        BillingMeter::VideoOutputSecond => 26,
        BillingMeter::VideoResult => 27,
        BillingMeter::MusicOutputSecond => 28,
        BillingMeter::SfxResult => 29,
        BillingMeter::RerankSearch => 30,
        BillingMeter::RerankDocument => 31,
        BillingMeter::ApiRequest => 32,
        BillingMeter::ApiResult => 33,
        BillingMeter::ApiItem => 34,
        BillingMeter::ToolCall => 35,
        BillingMeter::WebSearchCall => 36,
        BillingMeter::FileSearchCall => 37,
        BillingMeter::CodeInterpreterSession => 38,
        BillingMeter::ContainerSession => 39,
        BillingMeter::StorageGbDay => 40,
        BillingMeter::BandwidthGb => 41,
        BillingMeter::Unknown => 99,
    }
}

fn adapter_usage_pricing_snapshot(
    invocation: &AdapterInvocationRequest,
    usage_line: &AdapterUsageLine,
    line_index: usize,
    catalog_key: &str,
    requested_model_catalog_key: &str,
    requested_model: &str,
    provider_native_model: &str,
    billing_meter: &BillingMeter,
    price: &sdkwork_claw_product::application::ResolvedModelPrice,
) -> String {
    json!({
        "source": "provider_adapter_usage_line",
        "lineIndex": line_index,
        "meter": {
            "code": billing_meter.code(),
            "billableUnit": usage_line.billable_unit.as_deref(),
            "estimated": usage_line.estimated
        },
        "model": {
            "catalogKey": catalog_key,
            "requestedCatalogKey": requested_model_catalog_key,
            "model": requested_model,
            "providerNativeModel": provider_native_model
        },
        "provider": {
            "code": invocation.provider.provider_code.as_str(),
            "channelId": invocation.provider.channel_id
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
        },
        "unitPrice": {
            "officialReference": price.official_reference.unit_price.to_fixed_string(6),
            "customerBeforeRate": price.customer_charge_before_rate.to_fixed_string(6),
            "customerCharge": price.customer_charge.to_fixed_string(6),
            "upstreamCost": price
                .upstream_cost
                .as_ref()
                .map(|upstream| upstream.unit_price.to_fixed_string(6))
                .unwrap_or_else(|| "0.000000".to_owned()),
            "currency": price.customer_charge.currency.as_str()
        },
        "adapter": {
            "invocationId": invocation.invocation.id.as_str(),
            "endpointKey": invocation.invocation.endpoint_key.as_str(),
            "standardPath": invocation.invocation.standard_path.as_str(),
            "usageSnapshot": usage_line.pricing_snapshot.as_ref()
        }
    })
    .to_string()
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

fn select_provider_native_channel_route<C>(
    catalog: &C,
    context: &AuthenticatedApiKeyContext,
    adapter_route: &ProviderAdapterRouteConfig,
) -> Result<ProviderChannelRoute, String>
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
        .select_channel_route(SelectProviderChannelRouteQuery {
            context: context.clone(),
            route_key,
            capability,
        })
        .map(|selection| selection.route)
        .map_err(|error| error.to_string())
}

fn channel_route_to_passthrough_target(
    route: &ProviderChannelRoute,
    secret_resolver: &(dyn ProviderSecretResolver + Send + Sync),
) -> Result<ProviderPassthroughTarget, String> {
    let base_url = route.base_url.as_deref().ok_or_else(|| {
        format!(
            "provider route is not available for configured channel route: selected channel {} has no base URL",
            route.channel_id
        )
    })?;
    let secret_ref = route.secret_ref.as_deref().ok_or_else(|| {
        format!(
            "provider route is not available for configured channel route: selected channel {} has no secret_ref",
            route.channel_id
        )
    })?;
    let secret_value = secret_resolver
        .resolve_secret_value(secret_ref)
        .map_err(|error| {
            format!("provider route is not available for configured channel route: {error}")
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
            request_id: Some(generate_server_request_id()),
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
            | "elevenlabs"
            | "midjourney"
            | "kling"
            | "vidu"
            | "nano-banana"
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use sdkwork_claw_product::domain::ModelVendor;
    use sdkwork_claw_product::domain::{
        AiModel, ApiKeyGroup, GatewayApiKey, ModelPrice, ModelProviderRoute, ModelVendorDefinition,
        Money, PriceSide, PricingPlan,
    };
    use sdkwork_claw_product::infrastructure::InMemoryPricingCatalog;

    #[test]
    fn adapter_meter_amount_charges_token_meters_per_million_and_duration_directly() {
        let token_amount = adapter_meter_amount(
            DecimalValue::parse("2.000000").unwrap(),
            "500000",
            &BillingMeter::LlmInputToken,
        )
        .unwrap();
        assert_eq!("1.000000000000", token_amount.to_fixed_string(12));

        let duration_amount = adapter_meter_amount(
            DecimalValue::parse("0.100000").unwrap(),
            "8.000000000000",
            &BillingMeter::VideoOutputSecond,
        )
        .unwrap();
        assert_eq!("0.800000000000", duration_amount.to_fixed_string(12));
    }

    #[test]
    fn adapter_token_counts_preserve_input_output_and_cache_dimensions() {
        let input = adapter_token_counts(&BillingMeter::LlmInputToken, "12").unwrap();
        assert_eq!(12, input.prompt_tokens);
        assert_eq!(0, input.completion_tokens);
        assert_eq!(0, input.cached_tokens);
        assert_eq!(12, input.total_tokens);

        let output = adapter_token_counts(&BillingMeter::LlmOutputToken, "7").unwrap();
        assert_eq!(0, output.prompt_tokens);
        assert_eq!(7, output.completion_tokens);
        assert_eq!(0, output.cached_tokens);
        assert_eq!(7, output.total_tokens);

        let cache = adapter_token_counts(&BillingMeter::LlmCacheReadToken, "5").unwrap();
        assert_eq!(0, cache.prompt_tokens);
        assert_eq!(0, cache.completion_tokens);
        assert_eq!(5, cache.cached_tokens);
        assert_eq!(5, cache.total_tokens);
    }

    #[test]
    fn adapter_generic_api_usage_infers_modality_from_endpoint() {
        let invocation =
            test_adapter_invocation("video.start_end2video", "/vidu/ent/v2/start-end2video");

        assert_eq!(
            MODALITY_VIDEO,
            adapter_modality_for_usage_line(&invocation, &BillingMeter::ApiRequest)
        );
    }

    #[test]
    fn adapter_usage_line_resolves_pricing_with_canonical_model_key_and_preserves_requested_key() {
        let mut catalog = InMemoryPricingCatalog::default();
        catalog.add_vendor(ModelVendorDefinition::new(
            "tencent-cloud",
            ModelVendor::Custom,
            "Tencent Cloud",
        ));
        catalog.add_model(AiModel::new(
            "vidu2.0",
            "Vidu 2.0",
            "tencent-cloud",
            vec!["video"],
        ));
        catalog.add_provider_route(
            ModelProviderRoute::new_for_catalog_key(
                "tencent-cloud/vidu2.0",
                "vidu2.0",
                "tencent-cloud",
                9301,
                "vidu2.0",
            )
            .with_provider_endpoint(Some("https://example.invalid/vidu"), Some("vault://test")),
        );
        catalog.add_plan(PricingPlan::new(
            "standard",
            PriceSide::OfficialReference,
            DecimalValue::parse("1.000000").unwrap(),
            Money::usd("0.000000").unwrap(),
        ));
        catalog.add_api_key_group(ApiKeyGroup::new(
            10,
            "standard-group",
            "standard",
            DecimalValue::parse("1.000000").unwrap(),
            DecimalValue::parse("1.000000").unwrap(),
        ));
        catalog.add_api_key(GatewayApiKey::new(100, 10, "sk-test", "hash-test"));
        catalog.add_price(ModelPrice::new_for_catalog_key(
            "tencent-cloud/vidu2.0",
            "vidu2.0",
            PriceSide::OfficialReference,
            BillingMeter::ApiRequest,
            Money::usd("0.020000").unwrap(),
        ));
        catalog.add_price(
            ModelPrice::new_for_catalog_key(
                "tencent-cloud/vidu2.0",
                "vidu2.0",
                PriceSide::UpstreamCost,
                BillingMeter::ApiRequest,
                Money::usd("0.010000").unwrap(),
            )
            .for_provider("tencent-cloud", 9301),
        );
        let context = AuthenticatedApiKeyContext {
            tenant_id: 10,
            organization_id: 20,
            user_id: 30,
            api_key_id: 100,
            api_key_name_snapshot: "Test key".to_owned(),
            group_id: 10,
            group_code: "standard-group".to_owned(),
            pricing_plan_code: "standard".to_owned(),
        };
        let invocation =
            test_adapter_invocation("video.start_end2video", "/vidu/ent/v2/start-end2video");
        let response = AdapterInvocationResponse::json_task(
            202,
            json!({"id": "adapter-task-usage-1", "status": "queued"}),
        );
        let usage_line = AdapterUsageLine::new("api_request", "1")
            .with_request_count(1)
            .with_provider_native_model("vidu2.0")
            .with_requested_model_catalog_key("tencent-cloud/global/vidu2.0");

        let command = adapter_usage_line_command(
            &catalog,
            &context,
            &invocation,
            &response,
            &usage_line,
            0,
            Some("Mozilla/5.0"),
        )
        .unwrap();

        assert_eq!("tencent-cloud/vidu2.0", command.catalog_key);
        assert_eq!(
            "tencent-cloud/global/vidu2.0",
            command.requested_model_catalog_key
        );
        assert_eq!("vidu2.0", command.requested_model);
        assert_eq!("vidu2.0", command.provider_native_model);
        assert_eq!("0.020000000000", command.official_reference_amount);
        assert_eq!("0.010000000000", command.upstream_cost_amount);
        assert!(command
            .pricing_snapshot
            .contains(r#""catalogKey":"tencent-cloud/vidu2.0""#));
        assert!(command
            .pricing_snapshot
            .contains(r#""requestedCatalogKey":"tencent-cloud/global/vidu2.0""#));
    }

    fn test_adapter_invocation(
        endpoint_key: &str,
        standard_path: &str,
    ) -> AdapterInvocationRequest {
        AdapterInvocationRequest {
            invocation: AdapterInvocationMetadata {
                id: "test-invocation".to_owned(),
                endpoint_key: endpoint_key.to_owned(),
                method: "POST".to_owned(),
                standard_path: standard_path.to_owned(),
                shape: AdapterInvocationShape::SyncJson,
                stream: false,
                request_id: Some("req-test".to_owned()),
                trace_id: Some("trace-test".to_owned()),
            },
            subject: AdapterSubject {
                tenant_id: 10,
                organization_id: 20,
                user_id: 30,
                api_key_id: 100,
                group_id: 10,
                group_code: "standard-group".to_owned(),
                pricing_plan_code: "standard".to_owned(),
            },
            provider: AdapterProviderContext {
                provider_code: "tencent-cloud".to_owned(),
                channel_id: 9301,
                provider_model: "vidu2.0".to_owned(),
                base_url: None,
                auth_profile: json!({"type": "bearer"}),
                timeout_ms: None,
            },
            secret: AdapterSecret::None,
            body: Value::Null,
        }
    }
}
