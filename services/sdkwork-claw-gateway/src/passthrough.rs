use axum::extract::Request;
use axum::extract::State;
use axum::http::header::{self, HeaderName, HeaderValue};
use axum::http::request::Builder as RequestBuilder;
use axum::http::HeaderMap;
use axum::http::{StatusCode, Uri};
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, MethodRouter};
use axum::{Json, Router};
use bytes::Bytes;
use http_body_util::{BodyExt, Full};
use hyper::Request as HyperRequest;
use hyper_rustls::HttpsConnector;
use hyper_util::client::legacy::connect::HttpConnector;
use hyper_util::client::legacy::Client;
use hyper_util::rt::TokioExecutor;
use sdkwork_claw_config::{
    ProviderPassthroughAuth, ProviderPassthroughAuthType, ProviderPassthroughHeader,
    ProviderRelayConfig,
};
use sdkwork_claw_http::ApiKeyIdentity;
use sdkwork_claw_product::application::{
    ApiKeyAuthenticator, ApiKeySecretHasher, AuthenticateApiKeyQuery,
};
use sdkwork_claw_product::ports::PricingCatalog;
use serde_json::json;
use std::collections::HashSet;
use std::sync::Arc;

type PassthroughBody = Full<Bytes>;
type PassthroughConnector = HttpsConnector<HttpConnector>;
type PassthroughClient = Client<PassthroughConnector, PassthroughBody>;

#[derive(Clone)]
struct ProviderPassthroughRuntime {
    client: PassthroughClient,
    providers: Arc<Vec<ProviderPassthroughTarget>>,
}

#[derive(Clone)]
struct ProviderPassthroughTarget {
    provider: String,
    base_url: String,
    auth: ProviderPassthroughAuth,
    default_headers: Vec<ProviderPassthroughHeader>,
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

fn apply_openai_passthrough_routes<S>(mut router: Router<S>, handler: MethodRouter<S>) -> Router<S>
where
    S: Clone + Send + Sync + 'static,
{
    for path in OPENAI_COMPATIBLE_PASSTHROUGH_PATHS {
        router = router.route(path, handler.clone());
    }
    router
}

fn apply_stored_chat_completion_passthrough_routes<S>(
    mut router: Router<S>,
    handler: MethodRouter<S>,
) -> Router<S>
where
    S: Clone + Send + Sync + 'static,
{
    for path in STORED_CHAT_COMPLETION_PASSTHROUGH_PATHS {
        router = router.route(path, handler.clone());
    }
    router
}

fn apply_openai_method_passthrough_routes<S>(
    mut router: Router<S>,
    handler: MethodRouter<S>,
) -> Router<S>
where
    S: Clone + Send + Sync + 'static,
{
    for path in OPENAI_METHOD_PASSTHROUGH_PATHS {
        router = router.route(path, handler.clone());
    }
    router
}

const OPENAI_COMPATIBLE_PASSTHROUGH_PATHS: &[&str] = &[
    "/v1/completions",
    "/v1/moderations",
    "/v1/responses/input_tokens",
    "/v1/responses/compact",
    "/v1/responses/{response_id}",
    "/v1/responses/{response_id}/cancel",
    "/v1/responses/{response_id}/input_items",
    "/v1/images/generations",
    "/v1/images/edits",
    "/v1/images/variations",
    "/v1/videos",
    "/v1/videos/characters",
    "/v1/videos/characters/{character_id}",
    "/v1/videos/edits",
    "/v1/videos/extensions",
    "/v1/videos/{video_id}",
    "/v1/videos/{video_id}/content",
    "/v1/videos/{video_id}/remix",
    "/v1/audio/speech",
    "/v1/audio/voices",
    "/v1/audio/voices/{voice_id}",
    "/v1/audio/voice_consents",
    "/v1/audio/voice_consents/{consent_id}",
    "/v1/audio/transcriptions",
    "/v1/audio/translations",
    "/v1/files",
    "/v1/files/{file_id}",
    "/v1/files/{file_id}/content",
    "/v1/vector_stores",
    "/v1/vector_stores/{vector_store_id}",
    "/v1/vector_stores/{vector_store_id}/search",
    "/v1/vector_stores/{vector_store_id}/files",
    "/v1/vector_stores/{vector_store_id}/files/{file_id}",
    "/v1/vector_stores/{vector_store_id}/file_batches",
    "/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}",
    "/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel",
    "/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}/files",
    "/v1/assistants",
    "/v1/assistants/{assistant_id}",
    "/v1/threads",
    "/v1/threads/runs",
    "/v1/threads/{thread_id}",
    "/v1/threads/{thread_id}/messages",
    "/v1/threads/{thread_id}/messages/{message_id}",
    "/v1/threads/{thread_id}/runs",
    "/v1/threads/{thread_id}/runs/{run_id}",
    "/v1/threads/{thread_id}/runs/{run_id}/cancel",
    "/v1/threads/{thread_id}/runs/{run_id}/submit_tool_outputs",
    "/v1/threads/{thread_id}/runs/{run_id}/steps",
    "/v1/threads/{thread_id}/runs/{run_id}/steps/{step_id}",
    "/v1/batches",
    "/v1/batches/{batch_id}",
    "/v1/batches/{batch_id}/cancel",
    "/v1/fine_tuning/jobs",
    "/v1/fine_tuning/jobs/{fine_tuning_job_id}",
    "/v1/fine_tuning/jobs/{fine_tuning_job_id}/cancel",
    "/v1/fine_tuning/jobs/{fine_tuning_job_id}/pause",
    "/v1/fine_tuning/jobs/{fine_tuning_job_id}/resume",
    "/v1/fine_tuning/jobs/{fine_tuning_job_id}/events",
    "/v1/fine_tuning/jobs/{fine_tuning_job_id}/checkpoints",
    "/v1/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions",
    "/v1/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions/{permission_id}",
    "/v1/fine_tuning/alpha/graders/run",
    "/v1/fine_tuning/alpha/graders/validate",
    "/v1/conversations",
    "/v1/conversations/{conversation_id}",
    "/v1/conversations/{conversation_id}/items",
    "/v1/conversations/{conversation_id}/items/{item_id}",
    "/v1/containers",
    "/v1/containers/{container_id}",
    "/v1/containers/{container_id}/files",
    "/v1/containers/{container_id}/files/{file_id}",
    "/v1/containers/{container_id}/files/{file_id}/content",
    "/v1/evals",
    "/v1/evals/{eval_id}",
    "/v1/evals/{eval_id}/runs",
    "/v1/evals/{eval_id}/runs/{run_id}",
    "/v1/evals/{eval_id}/runs/{run_id}/output_items",
    "/v1/evals/{eval_id}/runs/{run_id}/output_items/{output_item_id}",
    "/v1/skills",
    "/v1/skills/{skill_id}",
    "/v1/skills/{skill_id}/content",
    "/v1/skills/{skill_id}/versions",
    "/v1/skills/{skill_id}/versions/{version}",
    "/v1/skills/{skill_id}/versions/{version}/content",
    "/v1/organization/costs",
    "/v1/organization/usage/completions",
    "/v1/organization/usage/embeddings",
    "/v1/organization/usage/moderations",
    "/v1/organization/usage/images",
    "/v1/organization/usage/audio_speeches",
    "/v1/organization/usage/audio_transcriptions",
    "/v1/organization/usage/vector_stores",
    "/v1/organization/usage/code_interpreter_sessions",
    "/v1/organization/audit_logs",
    "/v1/organization/admin_api_keys",
    "/v1/organization/admin_api_keys/{key_id}",
    "/v1/organization/invites",
    "/v1/organization/invites/{invite_id}",
    "/v1/organization/users",
    "/v1/organization/users/{user_id}",
    "/v1/organization/users/{user_id}/roles",
    "/v1/organization/users/{user_id}/roles/{role_id}",
    "/v1/organization/groups",
    "/v1/organization/groups/{group_id}",
    "/v1/organization/groups/{group_id}/users",
    "/v1/organization/groups/{group_id}/users/{user_id}",
    "/v1/organization/groups/{group_id}/roles",
    "/v1/organization/groups/{group_id}/roles/{role_id}",
    "/v1/organization/roles",
    "/v1/organization/roles/{role_id}",
    "/v1/organization/certificates",
    "/v1/organization/certificates/{certificate_id}",
    "/v1/organization/certificates/activate",
    "/v1/organization/certificates/deactivate",
    "/v1/organization/projects",
    "/v1/organization/projects/{project_id}",
    "/v1/organization/projects/{project_id}/archive",
    "/v1/organization/projects/{project_id}/users",
    "/v1/organization/projects/{project_id}/users/{user_id}",
    "/v1/organization/projects/{project_id}/service_accounts",
    "/v1/organization/projects/{project_id}/service_accounts/{service_account_id}",
    "/v1/organization/projects/{project_id}/api_keys",
    "/v1/organization/projects/{project_id}/api_keys/{key_id}",
    "/v1/organization/projects/{project_id}/rate_limits",
    "/v1/organization/projects/{project_id}/rate_limits/{rate_limit_id}",
    "/v1/organization/projects/{project_id}/groups",
    "/v1/organization/projects/{project_id}/groups/{group_id}",
    "/v1/organization/projects/{project_id}/certificates",
    "/v1/organization/projects/{project_id}/certificates/activate",
    "/v1/organization/projects/{project_id}/certificates/deactivate",
    "/v1/projects/{project_id}/roles",
    "/v1/projects/{project_id}/roles/{role_id}",
    "/v1/projects/{project_id}/users/{user_id}/roles",
    "/v1/projects/{project_id}/users/{user_id}/roles/{role_id}",
    "/v1/projects/{project_id}/groups/{group_id}/roles",
    "/v1/projects/{project_id}/groups/{group_id}/roles/{role_id}",
    "/v1/uploads",
    "/v1/uploads/{upload_id}/parts",
    "/v1/uploads/{upload_id}/complete",
    "/v1/uploads/{upload_id}/cancel",
    "/v1/realtime/client_secrets",
    "/v1/realtime/calls",
    "/v1/realtime/calls/{call_id}/accept",
    "/v1/realtime/calls/{call_id}/hangup",
    "/v1/realtime/calls/{call_id}/refer",
    "/v1/realtime/calls/{call_id}/reject",
    "/v1/realtime/sessions",
    "/v1/realtime/transcription_sessions",
    "/v1/realtime/translations",
];

pub fn openai_compatible_passthrough_paths() -> &'static [&'static str] {
    OPENAI_COMPATIBLE_PASSTHROUGH_PATHS
}

pub fn openai_method_passthrough_paths() -> &'static [&'static str] {
    OPENAI_METHOD_PASSTHROUGH_PATHS
}

pub fn stored_chat_completion_passthrough_paths() -> &'static [&'static str] {
    STORED_CHAT_COMPLETION_PASSTHROUGH_PATHS
}

const OPENAI_METHOD_PASSTHROUGH_PATHS: &[&str] = &["/v1/models/{model}"];

const STORED_CHAT_COMPLETION_PASSTHROUGH_PATHS: &[&str] = &[
    "/v1/chat/completions",
    "/v1/chat/completions/{completion_id}",
    "/v1/chat/completions/{completion_id}/messages",
];

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
    let identity = ApiKeyIdentity::from_headers_and_uri(headers, uri).map_err(|error| {
        passthrough_auth_error(
            StatusCode::BAD_REQUEST,
            "invalid_request",
            "invalid_request_error",
            error.to_string(),
        )
    })?;
    let Some(credential_secret) = identity.credential_secret() else {
        return Err(passthrough_auth_error(
            StatusCode::UNAUTHORIZED,
            "invalid_api_key",
            "invalid_request_error",
            "missing api key credential",
        ));
    };
    let authenticator =
        ApiKeyAuthenticator::new(state.catalog.as_ref(), state.api_key_hasher.as_ref());
    authenticator
        .authenticate(AuthenticateApiKeyQuery { credential_secret })
        .map(|_| ())
        .map_err(|_| {
            passthrough_auth_error(
                StatusCode::UNAUTHORIZED,
                "invalid_api_key",
                "invalid_request_error",
                "api key credential is invalid",
            )
        })
}

fn passthrough_auth_error(
    status: StatusCode,
    code: &'static str,
    error_type: &'static str,
    message: impl ToString,
) -> Response {
    (
        status,
        Json(json!({
            "error": {
                "message": message.to_string(),
                "type": error_type,
                "param": null,
                "code": code
            }
        })),
    )
        .into_response()
}

impl ProviderPassthroughRuntime {
    fn from_config(config: ProviderRelayConfig) -> Self {
        let openai_target = config
            .openai_relay()
            .map(|relay| ProviderPassthroughTarget {
                provider: "openai".to_owned(),
                base_url: relay.base_url().trim_end_matches('/').to_owned(),
                auth: ProviderPassthroughAuth::bearer(relay.bearer_token())
                    .expect("OpenAI relay bearer token is validated by config parser"),
                default_headers: Vec::new(),
            });
        Self {
            client: build_provider_passthrough_client(),
            providers: Arc::new(
                openai_target
                    .into_iter()
                    .chain(config.provider_passthrough_targets().iter().map(|target| {
                        ProviderPassthroughTarget {
                            provider: target.provider().to_owned(),
                            base_url: target.base_url().trim_end_matches('/').to_owned(),
                            auth: target.auth().clone(),
                            default_headers: target.default_headers().to_vec(),
                        }
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
            .find(|target| target.provider == "openai")
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
        let mut builder = HyperRequest::builder()
            .method(parts.method)
            .uri(upstream_uri);
        let connection_header_names = connection_header_names(&parts.headers);
        let configured_header_names = configured_provider_passthrough_header_names(target)?;
        for (name, value) in parts.headers.iter() {
            if should_forward_provider_request_header(
                name,
                &connection_header_names,
                &configured_header_names,
            ) {
                builder = builder.header(name, value);
            }
        }
        builder = apply_provider_passthrough_default_headers(builder, target)?;
        builder = apply_provider_passthrough_auth(builder, target)?;
        let upstream_request = builder
            .body(Full::new(body))
            .map_err(|error| format!("failed to build provider passthrough request: {error}"))?;
        let upstream_response = self
            .client
            .request(upstream_request)
            .await
            .map_err(|error| format!("provider passthrough upstream request failed: {error}"))?;
        Ok(upstream_to_axum_response(upstream_response))
    }

    fn target_for_path(&self, path: &str) -> Option<&ProviderPassthroughTarget> {
        provider_from_passthrough_path(path).and_then(|provider| {
            self.providers
                .iter()
                .find(|target| target.provider == provider)
        })
    }

    fn has_openai_target(&self) -> bool {
        self.providers
            .iter()
            .any(|target| target.provider == "openai")
    }
}

fn build_openai_passthrough_uri(
    target: &ProviderPassthroughTarget,
    original_uri: &Uri,
) -> Result<Uri, String> {
    let path_and_query = original_uri
        .path_and_query()
        .map(|value| value.as_str())
        .unwrap_or("/");
    format!("{}{}", target.base_url, path_and_query)
        .parse::<Uri>()
        .map_err(|error| format!("invalid OpenAI-compatible passthrough upstream URI: {error}"))
}

fn build_provider_passthrough_uri(
    target: &ProviderPassthroughTarget,
    original_uri: &Uri,
) -> Result<Uri, String> {
    let (_, provider_path) = split_provider_passthrough_path(original_uri.path())
        .ok_or_else(|| "provider passthrough path is invalid".to_owned())?;
    let mut path_and_query = match original_uri.query() {
        Some(query) => format!("/{provider_path}?{query}"),
        None => format!("/{provider_path}"),
    };
    if target.auth.auth_type() == ProviderPassthroughAuthType::Query {
        let name = target
            .auth
            .name()
            .ok_or_else(|| "provider passthrough query auth name is missing".to_owned())?;
        let separator = if path_and_query.contains('?') {
            '&'
        } else {
            '?'
        };
        path_and_query.push(separator);
        path_and_query.push_str(&percent_encode_query_component(name));
        path_and_query.push('=');
        path_and_query.push_str(&percent_encode_query_component(target.auth.value()));
    }
    format!("{}{}", target.base_url, path_and_query)
        .parse::<Uri>()
        .map_err(|error| format!("invalid provider passthrough upstream URI: {error}"))
}

fn percent_encode_query_component(value: &str) -> String {
    let mut encoded = String::new();
    for byte in value.bytes() {
        let character = byte as char;
        if character.is_ascii_alphanumeric() || matches!(character, '-' | '_' | '.' | '~') {
            encoded.push(character);
        } else {
            encoded.push_str(&format!("%{byte:02X}"));
        }
    }
    encoded
}

fn apply_provider_passthrough_auth(
    mut builder: RequestBuilder,
    target: &ProviderPassthroughTarget,
) -> Result<RequestBuilder, String> {
    match target.auth.auth_type() {
        ProviderPassthroughAuthType::Bearer => {
            let authorization = HeaderValue::from_str(
                format!("Bearer {}", target.auth.value()).as_str(),
            )
            .map_err(|error| format!("provider passthrough bearer token is invalid: {error}"))?;
            builder = builder.header(header::AUTHORIZATION, authorization);
        }
        ProviderPassthroughAuthType::Header => {
            let name = target
                .auth
                .name()
                .ok_or_else(|| "provider passthrough header auth name is missing".to_owned())?;
            let header_name = HeaderName::from_bytes(name.as_bytes()).map_err(|error| {
                format!("provider passthrough auth header name is invalid: {error}")
            })?;
            let header_value = HeaderValue::from_str(target.auth.value()).map_err(|error| {
                format!("provider passthrough auth header value is invalid: {error}")
            })?;
            builder = builder.header(header_name, header_value);
        }
        ProviderPassthroughAuthType::Query => {}
    }
    Ok(builder)
}

fn apply_provider_passthrough_default_headers(
    mut builder: RequestBuilder,
    target: &ProviderPassthroughTarget,
) -> Result<RequestBuilder, String> {
    for header in &target.default_headers {
        let header_name = HeaderName::from_bytes(header.name().as_bytes()).map_err(|error| {
            format!(
                "provider passthrough default header name {} is invalid: {error}",
                header.name()
            )
        })?;
        let header_value = HeaderValue::from_str(header.value()).map_err(|error| {
            format!(
                "provider passthrough default header {} value is invalid: {error}",
                header.name()
            )
        })?;
        builder = builder.header(header_name, header_value);
    }
    Ok(builder)
}

fn configured_provider_passthrough_header_names(
    target: &ProviderPassthroughTarget,
) -> Result<HashSet<String>, String> {
    let mut headers = target
        .default_headers
        .iter()
        .map(|header| header.name().to_owned())
        .collect::<HashSet<_>>();
    if target.auth.auth_type() == ProviderPassthroughAuthType::Header {
        let name = target
            .auth
            .name()
            .ok_or_else(|| "provider passthrough header auth name is missing".to_owned())?;
        headers.insert(name.to_ascii_lowercase());
    }
    Ok(headers)
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

fn upstream_to_axum_response(
    upstream_response: hyper::Response<hyper::body::Incoming>,
) -> Response {
    let (parts, body) = upstream_response.into_parts();
    let mut response = Response::new(axum::body::Body::new(body));
    *response.status_mut() = parts.status;
    let connection_header_names = connection_header_names(&parts.headers);
    for (name, value) in parts.headers.iter() {
        if should_forward_provider_response_header(name, &connection_header_names) {
            response.headers_mut().append(name, value.clone());
        }
    }
    response
}

fn build_provider_passthrough_client() -> PassthroughClient {
    let connector = hyper_rustls::HttpsConnectorBuilder::new()
        .with_webpki_roots()
        .https_or_http()
        .enable_http1()
        .build();
    Client::builder(TokioExecutor::new()).build(connector)
}

fn should_forward_provider_request_header(
    name: &HeaderName,
    connection_header_names: &HashSet<String>,
    configured_header_names: &HashSet<String>,
) -> bool {
    !is_hop_by_hop_header(name)
        && !connection_header_names.contains(name.as_str())
        && !configured_header_names.contains(name.as_str())
        && name != header::HOST
        && name != header::AUTHORIZATION
        && name != header::CONTENT_LENGTH
        && name.as_str() != "x-api-key"
        && name.as_str() != "x-goog-api-key"
        && name.as_str() != "x-forwarded-host"
        && name.as_str() != "x-forwarded-proto"
        && name.as_str() != "x-forwarded-for"
        && name.as_str() != "forwarded"
        && name.as_str() != "x-real-ip"
}

fn should_forward_provider_response_header(
    name: &HeaderName,
    connection_header_names: &HashSet<String>,
) -> bool {
    !is_hop_by_hop_header(name)
        && !connection_header_names.contains(name.as_str())
        && name != header::CONTENT_LENGTH
        && name != header::TRANSFER_ENCODING
        && !name.as_str().starts_with("access-control-")
}

fn connection_header_names(headers: &axum::http::HeaderMap) -> HashSet<String> {
    headers
        .get_all(header::CONNECTION)
        .iter()
        .filter_map(|value| value.to_str().ok())
        .flat_map(|value| value.split(','))
        .map(|value| value.trim().to_ascii_lowercase())
        .filter(|value| !value.is_empty())
        .collect()
}

fn is_hop_by_hop_header(name: &HeaderName) -> bool {
    matches!(
        name.as_str(),
        "connection"
            | "keep-alive"
            | "proxy-authenticate"
            | "proxy-authorization"
            | "te"
            | "trailer"
            | "transfer-encoding"
            | "upgrade"
    )
}
