use std::collections::VecDeque;
use std::io;
use std::pin::Pin;
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::extract::{Path, Query, State};
use axum::http::{header, HeaderMap, HeaderValue, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use bytes::Bytes;
use futures_util::{Stream, StreamExt};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::Deserialize;
use serde::Serialize;
use serde_json::{Map, Value};

use crate::api::openai_runtime::resolve_openai_provider_route_plan;
use crate::api::response::PlusApiResult;
use crate::application::AuthenticatedApiKeyContext;
use crate::application::EntityUuidGenerator;
use crate::domain::{BillingMeter, DomainError, RoutingCapability};
use crate::infrastructure::OsApiKeySecretGenerator;
use crate::ports::{
    AppRuntimeArtifactItem, AppRuntimeArtifactList, AppRuntimeEventItem, AppRuntimeEventList,
    AppRuntimeFuture, AppRuntimeInvocationExecution, AppRuntimeInvocationItem,
    AppRuntimeInvocationList, AppRuntimeInvocationQuery, AppRuntimeStore, AppRuntimeSubject,
    ChatCompletionRelayRequest, ChatCompletionStreamRelay, CompleteAppRuntimeInvocationCommand,
    CreateAppRuntimeArtifactCommand, CreateAppRuntimeEventCommand,
    CreateAppRuntimeInvocationCommand, PricingCatalog,
};

const MAX_PAGE_SIZE: i64 = 100;
const MAX_ID_LEN: usize = 128;
const MAX_KIND_LEN: usize = 128;
const MAX_RUNTIME_LEN: usize = 128;
const MAX_ENDPOINT_LEN: usize = 128;
const MAX_MODEL_LEN: usize = 128;
const MAX_PROVIDER_LEN: usize = 128;
const MAX_NAME_LEN: usize = 512;
const MAX_PATH_LEN: usize = 2048;
const MAX_TEXT_LEN: usize = 256 * 1024;
const MAX_ERROR_LEN: usize = 1024;

#[derive(Clone)]
struct AppRuntimeState {
    store: Arc<dyn AppRuntimeStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    executor: Option<Arc<dyn AppRuntimeExecutor + Send + Sync>>,
    require_subject: bool,
}

trait AppRuntimeExecutor {
    fn execute_streaming_invocation<'a>(
        &'a self,
        store: Arc<dyn AppRuntimeStore + Send + Sync>,
        entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
        subject: AppRuntimeSubject,
        invocation_id: String,
    ) -> AppRuntimeFuture<'a, Response>;
}

struct OpenAiCompatibleRuntimeExecutor<C> {
    catalog: Arc<C>,
    chat_stream_relay: Arc<dyn ChatCompletionStreamRelay + Send + Sync>,
}

type BoxedByteStream = Pin<Box<dyn Stream<Item = Result<Bytes, axum::Error>> + Send>>;

struct RuntimeEventSseStreamState {
    provider_stream: BoxedByteStream,
    buffer: String,
    pending: VecDeque<Bytes>,
    done: bool,
    done_sent: bool,
    store: Arc<dyn AppRuntimeStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    subject: AppRuntimeSubject,
    invocation_id: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppRuntimeListQuery {
    page: Option<i64>,
    #[serde(rename = "pageSize")]
    page_size_camel: Option<i64>,
    #[serde(rename = "page_size")]
    page_size_snake: Option<i64>,
    conversation_id: Option<String>,
    chat_turn_id: Option<String>,
    agent_session_id: Option<String>,
    runtime: Option<String>,
    status: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppRuntimeCreateInvocationRequest {
    invocation_type: Option<String>,
    runtime: Option<String>,
    endpoint: Option<String>,
    status: Option<String>,
    conversation_id: Option<String>,
    chat_turn_id: Option<String>,
    chat_item_id: Option<String>,
    agent_session_id: Option<String>,
    agent_run_id: Option<String>,
    agent_run_step_id: Option<String>,
    request_id: Option<String>,
    trace_id: Option<String>,
    model: Option<String>,
    provider: Option<String>,
    tool_name: Option<String>,
    tool_call_id: Option<String>,
    cwd: Option<String>,
    sandbox_policy: Option<String>,
    approval_policy: Option<String>,
    permission_mode: Option<String>,
    streaming: Option<bool>,
    request_json: Option<Value>,
    metadata: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppRuntimeCompleteInvocationRequest {
    status: Option<String>,
    provider_response_id: Option<String>,
    provider_session_id: Option<String>,
    provider_conversation_id: Option<String>,
    provider_step_id: Option<String>,
    finish_reason: Option<String>,
    latency_ms: Option<i64>,
    ttft_ms: Option<i64>,
    exit_code: Option<i64>,
    error_type: Option<String>,
    error_code: Option<String>,
    error_message_masked: Option<String>,
    response_json: Option<Value>,
    usage_json: Option<Value>,
    metadata: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppRuntimeCreateEventRequest {
    event_type: Option<String>,
    event_source: Option<String>,
    payload_json: Option<Value>,
    text_delta: Option<String>,
    metadata: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppRuntimeCreateArtifactRequest {
    artifact_type: Option<String>,
    name: Option<String>,
    mime_type: Option<String>,
    content_text: Option<String>,
    content_json: Option<Value>,
    storage_key: Option<String>,
    storage_url: Option<String>,
    sha256: Option<String>,
    size_bytes: Option<i64>,
    metadata: Option<Value>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppRuntimeInvocationEnvelope {
    item: AppRuntimeInvocationItem,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppRuntimeEventEnvelope {
    item: AppRuntimeEventItem,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppRuntimeArtifactEnvelope {
    item: AppRuntimeArtifactItem,
}

struct EmptyAppRuntimeStore;

impl AppRuntimeStore for EmptyAppRuntimeStore {
    fn list_invocations<'a>(
        &'a self,
        _subject: AppRuntimeSubject,
        _query: AppRuntimeInvocationQuery,
    ) -> AppRuntimeFuture<'a, AppRuntimeInvocationList> {
        Box::pin(async { Ok(AppRuntimeInvocationList { items: Vec::new() }) })
    }

    fn get_invocation<'a>(
        &'a self,
        _subject: AppRuntimeSubject,
        _invocation_id: String,
    ) -> AppRuntimeFuture<'a, Option<AppRuntimeInvocationItem>> {
        Box::pin(async { Ok(None) })
    }

    fn get_invocation_execution<'a>(
        &'a self,
        _subject: AppRuntimeSubject,
        _invocation_id: String,
    ) -> AppRuntimeFuture<'a, Option<AppRuntimeInvocationExecution>> {
        Box::pin(async { Ok(None) })
    }

    fn create_invocation<'a>(
        &'a self,
        _command: CreateAppRuntimeInvocationCommand,
    ) -> AppRuntimeFuture<'a, AppRuntimeInvocationItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app runtime store is unavailable without database configuration",
            ))
        })
    }

    fn complete_invocation<'a>(
        &'a self,
        _command: CompleteAppRuntimeInvocationCommand,
    ) -> AppRuntimeFuture<'a, AppRuntimeInvocationItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app runtime store is unavailable without database configuration",
            ))
        })
    }

    fn list_events<'a>(
        &'a self,
        _subject: AppRuntimeSubject,
        _invocation_id: String,
        _page: i64,
        _page_size: i64,
    ) -> AppRuntimeFuture<'a, AppRuntimeEventList> {
        Box::pin(async { Ok(AppRuntimeEventList { items: Vec::new() }) })
    }

    fn create_event<'a>(
        &'a self,
        _command: CreateAppRuntimeEventCommand,
    ) -> AppRuntimeFuture<'a, AppRuntimeEventItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app runtime store is unavailable without database configuration",
            ))
        })
    }

    fn list_artifacts<'a>(
        &'a self,
        _subject: AppRuntimeSubject,
        _invocation_id: String,
        _page: i64,
        _page_size: i64,
    ) -> AppRuntimeFuture<'a, AppRuntimeArtifactList> {
        Box::pin(async { Ok(AppRuntimeArtifactList { items: Vec::new() }) })
    }

    fn create_artifact<'a>(
        &'a self,
        _command: CreateAppRuntimeArtifactCommand,
    ) -> AppRuntimeFuture<'a, AppRuntimeArtifactItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app runtime store is unavailable without database configuration",
            ))
        })
    }
}

pub fn app_runtime_router() -> Router {
    app_runtime_router_with_state(
        Arc::new(EmptyAppRuntimeStore),
        Arc::new(OsApiKeySecretGenerator),
        None,
        false,
    )
}

pub fn app_runtime_router_with_store(
    store: Arc<dyn AppRuntimeStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    app_runtime_router_with_state(store, entity_uuid_generator, None, true)
}

pub fn app_runtime_router_with_store_and_chat_stream_relay<C>(
    store: Arc<dyn AppRuntimeStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    catalog: Arc<C>,
    chat_stream_relay: Arc<dyn ChatCompletionStreamRelay + Send + Sync>,
) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let executor: Arc<dyn AppRuntimeExecutor + Send + Sync> =
        Arc::new(OpenAiCompatibleRuntimeExecutor {
            catalog,
            chat_stream_relay,
        });
    app_runtime_router_with_state(store, entity_uuid_generator, Some(executor), true)
}

fn app_runtime_router_with_state(
    store: Arc<dyn AppRuntimeStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    executor: Option<Arc<dyn AppRuntimeExecutor + Send + Sync>>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route(
            "/app/v3/api/runtime/invocations",
            get(list_invocations).post(create_invocation),
        )
        .route(
            "/app/v3/api/runtime/invocations/{invocation_id}",
            get(get_invocation),
        )
        .route(
            "/app/v3/api/runtime/invocations/{invocation_id}/complete",
            axum::routing::post(complete_invocation),
        )
        .route(
            "/app/v3/api/runtime/invocations/{invocation_id}/events",
            get(list_events).post(create_event),
        )
        .route(
            "/app/v3/api/runtime/invocations/{invocation_id}/events/stream",
            get(stream_events),
        )
        .route(
            "/app/v3/api/runtime/invocations/{invocation_id}/artifacts",
            get(list_artifacts).post(create_artifact),
        )
        .with_state(AppRuntimeState {
            store,
            entity_uuid_generator,
            executor,
            require_subject,
        })
}

async fn list_invocations(
    State(state): State<AppRuntimeState>,
    headers: HeaderMap,
    Query(query): Query<AppRuntimeListQuery>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match normalize_invocation_query(query) {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };
    match state.store.list_invocations(subject, query).await {
        Ok(list) => Json(PlusApiResult::success(list)).into_response(),
        Err(error) => app_runtime_system_response("app runtime invocations are unavailable", error),
    }
}

async fn get_invocation(
    State(state): State<AppRuntimeState>,
    headers: HeaderMap,
    Path(invocation_id): Path<String>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let invocation_id = match normalize_id(&invocation_id, "invocationId") {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    match state.store.get_invocation(subject, invocation_id).await {
        Ok(Some(item)) => Json(PlusApiResult::success(item)).into_response(),
        Ok(None) => not_found("runtime invocation was not found"),
        Err(error) => app_runtime_system_response("app runtime invocation is unavailable", error),
    }
}

async fn create_invocation(
    State(state): State<AppRuntimeState>,
    headers: HeaderMap,
    Json(request): Json<AppRuntimeCreateInvocationRequest>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_create_invocation_command(&state, subject, request) {
        Ok(command) => command,
        Err(AppRuntimeBuildError::BadRequest(message)) => return bad_request(message),
        Err(AppRuntimeBuildError::System(error)) => {
            return app_runtime_system_response("app runtime invocation command is invalid", error);
        }
    };
    match state.store.create_invocation(command).await {
        Ok(item) => Json(PlusApiResult::success(AppRuntimeInvocationEnvelope {
            item,
        }))
        .into_response(),
        Err(error) if error.is_conflict() => conflict(error.to_string()),
        Err(error) => app_runtime_system_response("app runtime invocation is unavailable", error),
    }
}

async fn complete_invocation(
    State(state): State<AppRuntimeState>,
    headers: HeaderMap,
    Path(invocation_id): Path<String>,
    Json(request): Json<AppRuntimeCompleteInvocationRequest>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_complete_invocation_command(&state, subject, invocation_id, request) {
        Ok(command) => command,
        Err(AppRuntimeBuildError::BadRequest(message)) => return bad_request(message),
        Err(AppRuntimeBuildError::System(error)) => {
            return app_runtime_system_response("app runtime completion command is invalid", error);
        }
    };
    match state.store.complete_invocation(command).await {
        Ok(item) => Json(PlusApiResult::success(AppRuntimeInvocationEnvelope {
            item,
        }))
        .into_response(),
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) if error.is_conflict() => conflict(error.to_string()),
        Err(error) => app_runtime_system_response("app runtime invocation is unavailable", error),
    }
}

async fn list_events(
    State(state): State<AppRuntimeState>,
    headers: HeaderMap,
    Path(invocation_id): Path<String>,
    Query(query): Query<AppRuntimeListQuery>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let invocation_id = match normalize_id(&invocation_id, "invocationId") {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    let (page, page_size) =
        normalize_page(query.page, query.page_size_camel, query.page_size_snake);
    match state
        .store
        .list_events(subject, invocation_id, page, page_size)
        .await
    {
        Ok(list) => Json(PlusApiResult::success(list)).into_response(),
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) => app_runtime_system_response("app runtime events are unavailable", error),
    }
}

async fn stream_events(
    State(state): State<AppRuntimeState>,
    headers: HeaderMap,
    Path(invocation_id): Path<String>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let invocation_id = match normalize_id(&invocation_id, "invocationId") {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    match state
        .store
        .list_events(subject, invocation_id.clone(), 1, MAX_PAGE_SIZE)
        .await
    {
        Ok(list) if !list.items.is_empty() => runtime_events_sse_response(list.items),
        Ok(_) => execute_or_complete_empty_stream(state, subject, invocation_id).await,
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) => app_runtime_system_response("app runtime event stream is unavailable", error),
    }
}

async fn execute_or_complete_empty_stream(
    state: AppRuntimeState,
    subject: AppRuntimeSubject,
    invocation_id: String,
) -> Response {
    let Some(executor) = state.executor.clone() else {
        return app_runtime_system_response(
            "app runtime event stream is unavailable",
            DomainError::new("OpenAI-compatible runtime stream executor is not configured"),
        );
    };
    match executor
        .execute_streaming_invocation(
            state.store.clone(),
            state.entity_uuid_generator.clone(),
            subject,
            invocation_id,
        )
        .await
    {
        Ok(response) => response,
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) => app_runtime_system_response("app runtime event stream is unavailable", error),
    }
}

async fn create_event(
    State(state): State<AppRuntimeState>,
    headers: HeaderMap,
    Path(invocation_id): Path<String>,
    Json(request): Json<AppRuntimeCreateEventRequest>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_create_event_command(&state, subject, invocation_id, request) {
        Ok(command) => command,
        Err(AppRuntimeBuildError::BadRequest(message)) => return bad_request(message),
        Err(AppRuntimeBuildError::System(error)) => {
            return app_runtime_system_response("app runtime event command is invalid", error);
        }
    };
    match state.store.create_event(command).await {
        Ok(item) => Json(PlusApiResult::success(AppRuntimeEventEnvelope { item })).into_response(),
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) if error.is_conflict() => conflict(error.to_string()),
        Err(error) => app_runtime_system_response("app runtime event is unavailable", error),
    }
}

async fn list_artifacts(
    State(state): State<AppRuntimeState>,
    headers: HeaderMap,
    Path(invocation_id): Path<String>,
    Query(query): Query<AppRuntimeListQuery>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let invocation_id = match normalize_id(&invocation_id, "invocationId") {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    let (page, page_size) =
        normalize_page(query.page, query.page_size_camel, query.page_size_snake);
    match state
        .store
        .list_artifacts(subject, invocation_id, page, page_size)
        .await
    {
        Ok(list) => Json(PlusApiResult::success(list)).into_response(),
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) => app_runtime_system_response("app runtime artifacts are unavailable", error),
    }
}

async fn create_artifact(
    State(state): State<AppRuntimeState>,
    headers: HeaderMap,
    Path(invocation_id): Path<String>,
    Json(request): Json<AppRuntimeCreateArtifactRequest>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_create_artifact_command(&state, subject, invocation_id, request) {
        Ok(command) => command,
        Err(AppRuntimeBuildError::BadRequest(message)) => return bad_request(message),
        Err(AppRuntimeBuildError::System(error)) => {
            return app_runtime_system_response("app runtime artifact command is invalid", error);
        }
    };
    match state.store.create_artifact(command).await {
        Ok(item) => {
            Json(PlusApiResult::success(AppRuntimeArtifactEnvelope { item })).into_response()
        }
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) if error.is_conflict() => conflict(error.to_string()),
        Err(error) => app_runtime_system_response("app runtime artifact is unavailable", error),
    }
}

fn runtime_events_sse_response(items: Vec<AppRuntimeEventItem>) -> Response {
    let mut body = String::new();
    for item in items {
        match serde_json::to_string(&item) {
            Ok(payload) => {
                body.push_str("data: ");
                body.push_str(&payload);
                body.push_str("\n\n");
            }
            Err(error) => {
                return app_runtime_system_response(
                    "app runtime event stream serialization failed",
                    DomainError::new(error.to_string()),
                );
            }
        }
    }
    body.push_str("data: [DONE]\n\n");

    let mut response = body.into_response();
    let headers = response.headers_mut();
    headers.insert(
        header::CONTENT_TYPE,
        HeaderValue::from_static("text/event-stream"),
    );
    headers.insert(header::CACHE_CONTROL, HeaderValue::from_static("no-cache"));
    headers.insert("x-accel-buffering", HeaderValue::from_static("no"));
    response
}

fn runtime_provider_stream_sse_response(
    store: Arc<dyn AppRuntimeStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    subject: AppRuntimeSubject,
    invocation_id: String,
    body: Body,
) -> Response {
    let provider_stream = Box::pin(body.into_data_stream().map(|chunk| {
        chunk.map_err(|error| {
            axum::Error::new(io::Error::new(
                io::ErrorKind::Other,
                format!("provider stream body failed: {error}"),
            ))
        })
    }));
    let stream_state = RuntimeEventSseStreamState {
        provider_stream,
        buffer: String::new(),
        pending: VecDeque::new(),
        done: false,
        done_sent: false,
        store,
        entity_uuid_generator,
        subject,
        invocation_id,
    };
    let stream = futures_util::stream::unfold(stream_state, next_runtime_sse_chunk);
    let mut response = Body::from_stream(stream).into_response();
    let headers = response.headers_mut();
    headers.insert(
        header::CONTENT_TYPE,
        HeaderValue::from_static("text/event-stream"),
    );
    headers.insert(header::CACHE_CONTROL, HeaderValue::from_static("no-cache"));
    headers.insert("x-accel-buffering", HeaderValue::from_static("no"));
    response
}

impl<C> AppRuntimeExecutor for OpenAiCompatibleRuntimeExecutor<C>
where
    C: PricingCatalog + Send + Sync + 'static,
{
    fn execute_streaming_invocation<'a>(
        &'a self,
        store: Arc<dyn AppRuntimeStore + Send + Sync>,
        entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
        subject: AppRuntimeSubject,
        invocation_id: String,
    ) -> AppRuntimeFuture<'a, Response> {
        Box::pin(async move {
            let Some(execution) = store
                .get_invocation_execution(subject, invocation_id.clone())
                .await?
            else {
                return Err(DomainError::not_found("runtime invocation was not found"));
            };
            if !is_executable_openai_compatible_stream(&execution.item) {
                return Err(DomainError::new(format!(
                    "runtime invocation is not executable as an OpenAI-compatible stream: runtime={}, endpoint={}, status={}, streaming={}",
                    execution.item.runtime,
                    execution.item.endpoint.as_deref().unwrap_or(""),
                    execution.item.status,
                    execution.item.streaming
                )));
            }
            let context =
                runtime_authenticated_context(self.catalog.as_ref(), subject, &execution)?;
            let model = execution.item.model.as_deref().ok_or_else(|| {
                DomainError::new("runtime invocation model is required for stream execution")
            })?;
            let route_plan = resolve_openai_provider_route_plan(
                self.catalog.as_ref(),
                &context,
                model,
                &["chat"],
                "chat",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            )
            .map_err(openai_route_response_error)?;
            let route = route_plan.first_route();
            let request_body = build_runtime_chat_request_body(model, &execution.request_json)?;
            let response = self
                .chat_stream_relay
                .create_chat_completion_stream(ChatCompletionRelayRequest {
                    api_key_id: context.api_key_id,
                    tenant_id: context.tenant_id,
                    organization_id: context.organization_id,
                    user_id: context.user_id,
                    group_id: context.group_id,
                    group_code: context.group_code.clone(),
                    pricing_plan_code: context.pricing_plan_code.clone(),
                    model: model.to_owned(),
                    provider_code: route.provider_code.clone(),
                    provider_channel_id: route.channel_id,
                    provider_model: route.provider_model.clone(),
                    provider_base_url: route.provider_base_url.clone(),
                    provider_secret_ref: route.provider_secret_ref.clone(),
                    provider_auth_profile: route.provider_auth_profile.clone(),
                    provider_timeout_ms: route.provider_timeout_ms,
                    provider_retry_policy: route.provider_retry_policy.clone(),
                    request_body,
                })
                .await?;
            if !(200..300).contains(&response.status_code) {
                return Err(DomainError::new(format!(
                    "provider stream relay returned HTTP {}",
                    response.status_code
                )));
            }
            Ok(runtime_provider_stream_sse_response(
                store,
                entity_uuid_generator,
                subject,
                invocation_id,
                response.body,
            ))
        })
    }
}

fn is_executable_openai_compatible_stream(item: &AppRuntimeInvocationItem) -> bool {
    item.streaming
        && item.runtime == "openai_compatible"
        && matches!(item.status.as_str(), "pending" | "running" | "streaming")
        && matches!(
            item.endpoint.as_deref(),
            Some("chat.stream") | Some("agent.stream") | None
        )
}

fn runtime_authenticated_context<C>(
    catalog: &C,
    subject: AppRuntimeSubject,
    execution: &AppRuntimeInvocationExecution,
) -> Result<AuthenticatedApiKeyContext, DomainError>
where
    C: PricingCatalog,
{
    let route_key_id = execution
        .request_json
        .get("routeKeyId")
        .and_then(Value::as_i64)
        .or_else(|| {
            execution
                .request_json
                .get("route_key_id")
                .and_then(Value::as_i64)
        });
    let api_key = match route_key_id {
        Some(api_key_id) => catalog.find_api_key(api_key_id).ok_or_else(|| {
            DomainError::new(format!("runtime route API key was not found: {api_key_id}"))
        })?,
        None => catalog
            .list_api_keys()
            .into_iter()
            .filter(|api_key| api_key.tenant_id == subject.tenant_id)
            .filter(|api_key| api_key.organization_id == subject.organization_id)
            .filter(|api_key| api_key.user_id == subject.user_id)
            .filter(|api_key| api_key.status_code == 1)
            .min_by_key(|api_key| api_key.id)
            .ok_or_else(|| DomainError::new("runtime route API key is required"))?,
    };
    if api_key.tenant_id != subject.tenant_id
        || api_key.organization_id != subject.organization_id
        || api_key.user_id != subject.user_id
    {
        return Err(DomainError::new(
            "runtime route API key does not belong to trusted subject",
        ));
    }
    if api_key.status_code != 1 {
        return Err(DomainError::new("runtime route API key is disabled"));
    }
    let group = catalog
        .find_api_key_group(api_key.group_id)
        .ok_or_else(|| DomainError::new("runtime route API key group is not available"))?;
    Ok(AuthenticatedApiKeyContext {
        api_key_id: api_key.id,
        tenant_id: api_key.tenant_id,
        organization_id: api_key.organization_id,
        user_id: api_key.user_id,
        api_key_name_snapshot: api_key.display_name(),
        group_id: group.id,
        group_code: group.code,
        pricing_plan_code: group.pricing_plan_code,
    })
}

fn build_runtime_chat_request_body(
    model: &str,
    request_json: &Value,
) -> Result<Value, DomainError> {
    let mut object = request_json
        .as_object()
        .cloned()
        .ok_or_else(|| DomainError::new("runtime requestJson must be an object"))?;
    object.insert("model".to_owned(), Value::String(model.to_owned()));
    object.insert("stream".to_owned(), Value::Bool(true));

    let messages = object
        .get("messages")
        .filter(|value| matches!(value, Value::Array(items) if !items.is_empty()))
        .cloned()
        .or_else(|| {
            object
                .get("prompt")
                .and_then(Value::as_str)
                .map(str::trim)
                .filter(|prompt| !prompt.is_empty())
                .map(|prompt| serde_json::json!([{ "role": "user", "content": prompt }]))
        })
        .ok_or_else(|| DomainError::new("runtime requestJson messages or prompt is required"))?;
    object.insert("messages".to_owned(), messages);

    if let Some(stream_options) = object.remove("streamOptions") {
        object.insert("stream_options".to_owned(), stream_options);
    }
    let stream_options = object
        .entry("stream_options".to_owned())
        .or_insert_with(|| Value::Object(Map::new()));
    if !stream_options.is_object() {
        *stream_options = Value::Object(Map::new());
    }
    stream_options
        .as_object_mut()
        .expect("stream_options is normalized to an object")
        .entry("include_usage".to_owned())
        .or_insert(Value::Bool(true));

    for runtime_only_field in [
        "routeKeyId",
        "route_key_id",
        "selectedModel",
        "selected_model",
        "generationConfig",
        "generation_config",
        "referenceImages",
        "reference_images",
        "targetType",
        "target_type",
        "prompt",
    ] {
        object.remove(runtime_only_field);
    }
    Ok(Value::Object(object))
}

async fn persist_provider_sse_event(
    store: &(dyn AppRuntimeStore + Send + Sync),
    entity_uuid_generator: &(dyn EntityUuidGenerator + Send + Sync),
    subject: AppRuntimeSubject,
    invocation_id: &str,
    event: &str,
    pending: &mut VecDeque<Bytes>,
) -> Result<bool, DomainError> {
    let data = event
        .lines()
        .filter_map(|line| line.strip_prefix("data:"))
        .map(str::trim_start)
        .collect::<Vec<_>>()
        .join("\n");
    if data.trim().is_empty() {
        return Ok(false);
    }
    if data.trim() == "[DONE]" {
        return Ok(true);
    }
    let payload = serde_json::from_str::<Value>(&data).map_err(|error| {
        DomainError::new(format!("provider stream event JSON is invalid: {error}"))
    })?;
    for delta in extract_stream_text_deltas(&payload) {
        if delta.is_empty() {
            continue;
        }
        let event_uuid = entity_uuid_generator.generate_entity_uuid()?;
        let item = store
            .create_event(CreateAppRuntimeEventCommand {
                subject,
                invocation_id: invocation_id.to_owned(),
                event_uuid,
                event_type: "response.output_text.delta".to_owned(),
                event_source: "provider".to_owned(),
                payload_json: serde_json::json!({ "delta": delta.clone(), "providerEvent": payload.clone() }),
                text_delta: Some(delta),
                metadata: Value::Object(Map::new()),
                requested_at: current_timestamp_string(),
            })
            .await?;
        pending.push_back(runtime_event_sse_bytes(&item)?);
    }
    Ok(false)
}

fn runtime_event_sse_bytes(item: &AppRuntimeEventItem) -> Result<Bytes, DomainError> {
    let payload = serde_json::to_string(item).map_err(|error| {
        DomainError::new(format!("runtime event serialization failed: {error}"))
    })?;
    Ok(Bytes::from(format!("data: {payload}\n\n")))
}

fn extract_stream_text_deltas(payload: &Value) -> Vec<String> {
    let mut deltas = Vec::new();
    if let Some(choices) = payload.get("choices").and_then(Value::as_array) {
        for choice in choices {
            if let Some(delta) = choice.get("delta") {
                push_optional_text_delta(&mut deltas, delta.get("content").and_then(Value::as_str));
                push_optional_text_delta(&mut deltas, delta.get("text").and_then(Value::as_str));
                push_optional_text_delta(
                    &mut deltas,
                    delta.get("output_text").and_then(Value::as_str),
                );
                push_optional_text_delta(
                    &mut deltas,
                    delta.get("reasoning_content").and_then(Value::as_str),
                );
            }
            push_optional_text_delta(&mut deltas, choice.get("text").and_then(Value::as_str));
            push_optional_text_delta(&mut deltas, choice.get("content").and_then(Value::as_str));
            push_optional_text_delta(
                &mut deltas,
                choice.get("output_text").and_then(Value::as_str),
            );
            push_optional_text_delta(
                &mut deltas,
                choice
                    .get("message")
                    .and_then(|message| message.get("content"))
                    .and_then(Value::as_str),
            );
        }
    }
    push_optional_text_delta(&mut deltas, payload.get("delta").and_then(Value::as_str));
    push_optional_text_delta(&mut deltas, payload.get("text").and_then(Value::as_str));
    push_optional_text_delta(&mut deltas, payload.get("content").and_then(Value::as_str));
    push_optional_text_delta(
        &mut deltas,
        payload.get("output_text").and_then(Value::as_str),
    );
    push_optional_text_delta(
        &mut deltas,
        payload
            .get("response")
            .and_then(|response| response.get("output_text"))
            .and_then(Value::as_str),
    );
    collect_output_text_from_content_array(payload.get("content"), &mut deltas);
    collect_output_text_from_output_array(payload.get("output"), &mut deltas);
    collect_anthropic_content_block_delta(payload, &mut deltas);
    deltas
}

fn push_optional_text_delta(deltas: &mut Vec<String>, value: Option<&str>) {
    if let Some(value) = value {
        deltas.push(value.to_owned());
    }
}

fn collect_output_text_from_content_array(value: Option<&Value>, deltas: &mut Vec<String>) {
    let Some(items) = value.and_then(Value::as_array) else {
        return;
    };
    for item in items {
        push_optional_text_delta(deltas, item.get("text").and_then(Value::as_str));
        push_optional_text_delta(deltas, item.get("content").and_then(Value::as_str));
    }
}

fn collect_output_text_from_output_array(value: Option<&Value>, deltas: &mut Vec<String>) {
    let Some(items) = value.and_then(Value::as_array) else {
        return;
    };
    for item in items {
        push_optional_text_delta(deltas, item.get("text").and_then(Value::as_str));
        push_optional_text_delta(deltas, item.get("content").and_then(Value::as_str));
        collect_output_text_from_content_array(item.get("content"), deltas);
    }
}

fn collect_anthropic_content_block_delta(payload: &Value, deltas: &mut Vec<String>) {
    if payload.get("type").and_then(Value::as_str) != Some("content_block_delta") {
        return;
    }
    push_optional_text_delta(
        deltas,
        payload
            .get("delta")
            .and_then(|delta| delta.get("text"))
            .and_then(Value::as_str),
    );
}

fn next_sse_event_boundary(buffer: &str) -> Option<(usize, usize)> {
    [("\r\n\r\n", 4_usize), ("\n\n", 2_usize), ("\r\r", 2_usize)]
        .into_iter()
        .filter_map(|(needle, len)| buffer.find(needle).map(|index| (index, len)))
        .min_by_key(|(index, _)| *index)
}

fn openai_route_response_error(response: Box<Response>) -> DomainError {
    DomainError::new(format!(
        "runtime route selection failed with HTTP {}",
        response.status()
    ))
}

async fn next_runtime_sse_chunk(
    mut state: RuntimeEventSseStreamState,
) -> Option<(Result<Bytes, axum::Error>, RuntimeEventSseStreamState)> {
    if let Some(bytes) = state.pending.pop_front() {
        return Some((Ok(bytes), state));
    }
    if state.done {
        if state.done_sent {
            return None;
        }
        state.done_sent = true;
        return Some((Ok(Bytes::from_static(b"data: [DONE]\n\n")), state));
    }

    loop {
        match state.provider_stream.next().await {
            Some(Ok(chunk)) => {
                state.buffer.push_str(&String::from_utf8_lossy(&chunk));
                while let Some((boundary, boundary_len)) = next_sse_event_boundary(&state.buffer) {
                    let event = state.buffer[..boundary].to_owned();
                    state.buffer.drain(..boundary + boundary_len);
                    match persist_provider_sse_event(
                        state.store.as_ref(),
                        state.entity_uuid_generator.as_ref(),
                        state.subject,
                        &state.invocation_id,
                        &event,
                        &mut state.pending,
                    )
                    .await
                    {
                        Ok(done) => {
                            if done {
                                state.done = true;
                                break;
                            }
                        }
                        Err(error) => {
                            state.done = true;
                            return Some((Err(axum_error(error)), state));
                        }
                    }
                }
                if let Some(bytes) = state.pending.pop_front() {
                    return Some((Ok(bytes), state));
                }
                if state.done {
                    state.done_sent = true;
                    return Some((Ok(Bytes::from_static(b"data: [DONE]\n\n")), state));
                }
            }
            Some(Err(error)) => {
                state.done = true;
                return Some((Err(error), state));
            }
            None => {
                if !state.buffer.trim().is_empty() {
                    let event = std::mem::take(&mut state.buffer);
                    match persist_provider_sse_event(
                        state.store.as_ref(),
                        state.entity_uuid_generator.as_ref(),
                        state.subject,
                        &state.invocation_id,
                        &event,
                        &mut state.pending,
                    )
                    .await
                    {
                        Ok(_) => {}
                        Err(error) => {
                            state.done = true;
                            return Some((Err(axum_error(error)), state));
                        }
                    }
                    if let Some(bytes) = state.pending.pop_front() {
                        return Some((Ok(bytes), state));
                    }
                }
                state.done = true;
                state.done_sent = true;
                return Some((Ok(Bytes::from_static(b"data: [DONE]\n\n")), state));
            }
        }
    }
}

fn axum_error(error: DomainError) -> axum::Error {
    axum::Error::new(io::Error::new(io::ErrorKind::Other, error.to_string()))
}

fn build_create_invocation_command(
    state: &AppRuntimeState,
    subject: AppRuntimeSubject,
    request: AppRuntimeCreateInvocationRequest,
) -> Result<CreateAppRuntimeInvocationCommand, AppRuntimeBuildError> {
    let status = normalize_optional_text(request.status.as_deref(), "status", MAX_KIND_LEN)?
        .unwrap_or_else(|| "running".to_owned());
    validate_invocation_status(&status)?;
    Ok(CreateAppRuntimeInvocationCommand {
        subject,
        invocation_uuid: generate_entity_uuid(state)?,
        invocation_type: normalize_optional_text(
            request.invocation_type.as_deref(),
            "invocationType",
            MAX_KIND_LEN,
        )?
        .unwrap_or_else(|| "chat_response".to_owned()),
        runtime: normalize_required_text(request.runtime.as_deref(), "runtime", MAX_RUNTIME_LEN)?,
        endpoint: normalize_optional_text(
            request.endpoint.as_deref(),
            "endpoint",
            MAX_ENDPOINT_LEN,
        )?,
        status,
        conversation_id: normalize_optional_id(
            request.conversation_id.as_deref(),
            "conversationId",
        )?,
        chat_turn_id: normalize_optional_id(request.chat_turn_id.as_deref(), "chatTurnId")?,
        chat_item_id: normalize_optional_id(request.chat_item_id.as_deref(), "chatItemId")?,
        agent_session_id: normalize_optional_id(
            request.agent_session_id.as_deref(),
            "agentSessionId",
        )?,
        agent_run_id: normalize_optional_id(request.agent_run_id.as_deref(), "agentRunId")?,
        agent_run_step_id: normalize_optional_id(
            request.agent_run_step_id.as_deref(),
            "agentRunStepId",
        )?,
        request_id: normalize_optional_id(request.request_id.as_deref(), "requestId")?,
        trace_id: normalize_optional_id(request.trace_id.as_deref(), "traceId")?,
        model: normalize_optional_text(request.model.as_deref(), "model", MAX_MODEL_LEN)?,
        provider: normalize_optional_text(
            request.provider.as_deref(),
            "provider",
            MAX_PROVIDER_LEN,
        )?,
        tool_name: normalize_optional_text(request.tool_name.as_deref(), "toolName", MAX_KIND_LEN)?,
        tool_call_id: normalize_optional_id(request.tool_call_id.as_deref(), "toolCallId")?,
        cwd: normalize_optional_text(request.cwd.as_deref(), "cwd", MAX_PATH_LEN)?,
        sandbox_policy: normalize_optional_text(
            request.sandbox_policy.as_deref(),
            "sandboxPolicy",
            MAX_KIND_LEN,
        )?,
        approval_policy: normalize_optional_text(
            request.approval_policy.as_deref(),
            "approvalPolicy",
            MAX_KIND_LEN,
        )?,
        permission_mode: normalize_optional_text(
            request.permission_mode.as_deref(),
            "permissionMode",
            MAX_KIND_LEN,
        )?,
        streaming: request.streaming.unwrap_or(false),
        request_json: normalize_object(request.request_json, "requestJson")?,
        metadata: normalize_metadata(request.metadata)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_complete_invocation_command(
    _state: &AppRuntimeState,
    subject: AppRuntimeSubject,
    invocation_id: String,
    request: AppRuntimeCompleteInvocationRequest,
) -> Result<CompleteAppRuntimeInvocationCommand, AppRuntimeBuildError> {
    let status = normalize_optional_text(request.status.as_deref(), "status", MAX_KIND_LEN)?
        .unwrap_or_else(|| "completed".to_owned());
    validate_invocation_status(&status)?;
    validate_non_negative(request.latency_ms, "latencyMs")?;
    validate_non_negative(request.ttft_ms, "ttftMs")?;
    Ok(CompleteAppRuntimeInvocationCommand {
        subject,
        invocation_id: normalize_id(&invocation_id, "invocationId")?,
        status,
        provider_response_id: normalize_optional_id(
            request.provider_response_id.as_deref(),
            "providerResponseId",
        )?,
        provider_session_id: normalize_optional_id(
            request.provider_session_id.as_deref(),
            "providerSessionId",
        )?,
        provider_conversation_id: normalize_optional_id(
            request.provider_conversation_id.as_deref(),
            "providerConversationId",
        )?,
        provider_step_id: normalize_optional_id(
            request.provider_step_id.as_deref(),
            "providerStepId",
        )?,
        finish_reason: normalize_optional_text(
            request.finish_reason.as_deref(),
            "finishReason",
            MAX_KIND_LEN,
        )?,
        latency_ms: request.latency_ms,
        ttft_ms: request.ttft_ms,
        exit_code: request.exit_code,
        error_type: normalize_optional_text(
            request.error_type.as_deref(),
            "errorType",
            MAX_KIND_LEN,
        )?,
        error_code: normalize_optional_text(
            request.error_code.as_deref(),
            "errorCode",
            MAX_KIND_LEN,
        )?,
        error_message_masked: normalize_optional_text(
            request.error_message_masked.as_deref(),
            "errorMessageMasked",
            MAX_ERROR_LEN,
        )?,
        response_json: normalize_object(request.response_json, "responseJson")?,
        usage_json: normalize_object(request.usage_json, "usageJson")?,
        metadata: normalize_metadata(request.metadata)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_create_event_command(
    state: &AppRuntimeState,
    subject: AppRuntimeSubject,
    invocation_id: String,
    request: AppRuntimeCreateEventRequest,
) -> Result<CreateAppRuntimeEventCommand, AppRuntimeBuildError> {
    Ok(CreateAppRuntimeEventCommand {
        subject,
        invocation_id: normalize_id(&invocation_id, "invocationId")?,
        event_uuid: generate_entity_uuid(state)?,
        event_type: normalize_required_text(
            request.event_type.as_deref(),
            "eventType",
            MAX_KIND_LEN,
        )?,
        event_source: normalize_optional_text(
            request.event_source.as_deref(),
            "eventSource",
            MAX_KIND_LEN,
        )?
        .unwrap_or_else(|| "runtime".to_owned()),
        payload_json: normalize_object(request.payload_json, "payloadJson")?,
        text_delta: normalize_optional_text(
            request.text_delta.as_deref(),
            "textDelta",
            MAX_TEXT_LEN,
        )?,
        metadata: normalize_metadata(request.metadata)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_create_artifact_command(
    state: &AppRuntimeState,
    subject: AppRuntimeSubject,
    invocation_id: String,
    request: AppRuntimeCreateArtifactRequest,
) -> Result<CreateAppRuntimeArtifactCommand, AppRuntimeBuildError> {
    validate_non_negative(request.size_bytes, "sizeBytes")?;
    Ok(CreateAppRuntimeArtifactCommand {
        subject,
        invocation_id: normalize_id(&invocation_id, "invocationId")?,
        artifact_uuid: generate_entity_uuid(state)?,
        artifact_type: normalize_required_text(
            request.artifact_type.as_deref(),
            "artifactType",
            MAX_KIND_LEN,
        )?,
        name: normalize_optional_text(request.name.as_deref(), "name", MAX_NAME_LEN)?,
        mime_type: normalize_optional_text(request.mime_type.as_deref(), "mimeType", MAX_KIND_LEN)?,
        content_text: normalize_optional_text(
            request.content_text.as_deref(),
            "contentText",
            MAX_TEXT_LEN,
        )?,
        content_json: normalize_object(request.content_json, "contentJson")?,
        storage_key: normalize_optional_text(
            request.storage_key.as_deref(),
            "storageKey",
            MAX_PATH_LEN,
        )?,
        storage_url: normalize_optional_text(
            request.storage_url.as_deref(),
            "storageUrl",
            MAX_PATH_LEN,
        )?,
        sha256: normalize_optional_text(request.sha256.as_deref(), "sha256", MAX_KIND_LEN)?,
        size_bytes: request.size_bytes,
        metadata: normalize_metadata(request.metadata)?,
        requested_at: current_timestamp_string(),
    })
}

fn normalize_invocation_query(
    query: AppRuntimeListQuery,
) -> Result<AppRuntimeInvocationQuery, String> {
    let (page, page_size) =
        normalize_page(query.page, query.page_size_camel, query.page_size_snake);
    Ok(AppRuntimeInvocationQuery {
        page,
        page_size,
        conversation_id: normalize_optional_id(query.conversation_id.as_deref(), "conversationId")?,
        chat_turn_id: normalize_optional_id(query.chat_turn_id.as_deref(), "chatTurnId")?,
        agent_session_id: normalize_optional_id(
            query.agent_session_id.as_deref(),
            "agentSessionId",
        )?,
        runtime: normalize_optional_text(query.runtime.as_deref(), "runtime", MAX_RUNTIME_LEN)?,
        status: normalize_optional_text(query.status.as_deref(), "status", MAX_KIND_LEN)?,
    })
}

fn required_subject(
    state: &AppRuntimeState,
    headers: &HeaderMap,
) -> Result<AppRuntimeSubject, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(AppRuntimeSubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            user_id: subject.user_id,
        }),
        Err(error) if state.require_subject => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", error.to_string())),
        )
            .into_response()),
        Err(_) => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error(
                "4010",
                "trusted request subject is required for app runtime",
            )),
        )
            .into_response()),
    }
}

fn normalize_page(
    page: Option<i64>,
    page_size_camel: Option<i64>,
    page_size_snake: Option<i64>,
) -> (i64, i64) {
    let page = page.unwrap_or(1).max(1);
    let page_size = page_size_snake
        .or(page_size_camel)
        .unwrap_or(30)
        .max(1)
        .min(MAX_PAGE_SIZE);
    (page, page_size)
}

fn normalize_required_text(
    value: Option<&str>,
    field: &str,
    max_len: usize,
) -> Result<String, String> {
    normalize_optional_text(value, field, max_len)?.ok_or_else(|| format!("{field} is required"))
}

fn normalize_optional_text(
    value: Option<&str>,
    field: &str,
    max_len: usize,
) -> Result<Option<String>, String> {
    let Some(value) = value.map(str::trim).filter(|value| !value.is_empty()) else {
        return Ok(None);
    };
    if value.chars().count() > max_len {
        return Err(format!("{field} must be at most {max_len} characters"));
    }
    Ok(Some(value.to_owned()))
}

fn normalize_optional_id(value: Option<&str>, field: &str) -> Result<Option<String>, String> {
    value.map(|value| normalize_id(value, field)).transpose()
}

fn normalize_id(value: &str, field: &str) -> Result<String, String> {
    let value = value.trim();
    if value.is_empty() {
        return Err(format!("{field} is required"));
    }
    if value.chars().count() > MAX_ID_LEN {
        return Err(format!("{field} must be at most {MAX_ID_LEN} characters"));
    }
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b'.' | b':'))
    {
        return Err(format!("{field} contains unsupported characters"));
    }
    Ok(value.to_owned())
}

fn normalize_object(value: Option<Value>, field: &str) -> Result<Value, String> {
    match value {
        Some(Value::Object(_)) => Ok(value.unwrap()),
        Some(_) => Err(format!("{field} must be an object")),
        None => Ok(Value::Object(Map::new())),
    }
}

fn normalize_metadata(value: Option<Value>) -> Result<Value, String> {
    normalize_object(value, "metadata")
}

fn validate_invocation_status(status: &str) -> Result<(), String> {
    if matches!(
        status,
        "pending" | "running" | "streaming" | "completed" | "failed" | "cancelled"
    ) {
        Ok(())
    } else {
        Err(
            "status must be pending, running, streaming, completed, failed, or cancelled"
                .to_owned(),
        )
    }
}

fn validate_non_negative(value: Option<i64>, field: &str) -> Result<(), String> {
    if matches!(value, Some(value) if value < 0) {
        Err(format!("{field} must not be negative"))
    } else {
        Ok(())
    }
}

fn generate_entity_uuid(state: &AppRuntimeState) -> Result<String, AppRuntimeBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(AppRuntimeBuildError::System)
}

fn bad_request(message: impl Into<String>) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(PlusApiResult::error("4001", message.into())),
    )
        .into_response()
}

fn not_found(message: impl Into<String>) -> Response {
    (
        StatusCode::NOT_FOUND,
        Json(PlusApiResult::error("4040", message.into())),
    )
        .into_response()
}

fn conflict(message: impl Into<String>) -> Response {
    (
        StatusCode::CONFLICT,
        Json(PlusApiResult::error("4090", message.into())),
    )
        .into_response()
}

fn app_runtime_system_response(context: &str, error: DomainError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}

#[derive(Debug)]
enum AppRuntimeBuildError {
    BadRequest(String),
    System(DomainError),
}

impl From<String> for AppRuntimeBuildError {
    fn from(value: String) -> Self {
        Self::BadRequest(value)
    }
}

fn current_timestamp_string() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs() as i64;
    format_unix_timestamp(seconds)
}

fn format_unix_timestamp(seconds: i64) -> String {
    let days = seconds.div_euclid(86_400);
    let seconds_of_day = seconds.rem_euclid(86_400);
    let (year, month, day) = civil_from_days(days);
    let hour = seconds_of_day / 3_600;
    let minute = (seconds_of_day % 3_600) / 60;
    let second = seconds_of_day % 60;
    format!("{year:04}-{month:02}-{day:02} {hour:02}:{minute:02}:{second:02}")
}

fn civil_from_days(days: i64) -> (i64, i64, i64) {
    let z = days + 719_468;
    let era = if z >= 0 { z } else { z - 146_096 } / 146_097;
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1_460 + doe / 36_524 - doe / 146_096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = mp + if mp < 10 { 3 } else { -9 };
    let year = y + if m <= 2 { 1 } else { 0 };
    (year, m, d)
}
