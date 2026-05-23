use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::Deserialize;
use serde::Serialize;
use serde_json::{Map, Value};

use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::infrastructure::OsApiKeySecretGenerator;
use crate::ports::{
    AppAgentRunFuture, AppAgentRunItem, AppAgentRunList, AppAgentRunStepItem, AppAgentRunStepList,
    AppAgentRunStore, AppAgentRunSubject, CompleteAppAgentRunCommand,
    CompleteAppAgentRunStepCommand, CreateAppAgentRunCommand, CreateAppAgentRunStepCommand,
};

const MAX_PAGE_SIZE: i64 = 100;
const MAX_ID_LEN: usize = 128;
const MAX_KIND_LEN: usize = 128;
const MAX_SOURCE_SURFACE_LEN: usize = 64;
const MAX_MODEL_LEN: usize = 128;
const MAX_TITLE_LEN: usize = 256;
const MAX_MESSAGE_LEN: usize = 256 * 1024;
const MAX_ERROR_LEN: usize = 1024;
const MAX_MONEY_LEN: usize = 64;

#[derive(Clone)]
struct AppAgentRunState {
    store: Arc<dyn AppAgentRunStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppAgentRunListQuery {
    page: Option<i64>,
    #[serde(rename = "pageSize")]
    page_size_camel: Option<i64>,
    #[serde(rename = "page_size")]
    page_size_snake: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppAgentRunCreateRequest {
    agent_id: Option<String>,
    agent_version_id: Option<String>,
    request_id: Option<String>,
    trace_id: Option<String>,
    source_surface: Option<String>,
    input_message: Option<String>,
    memory_space_id: Option<String>,
    runtime: Option<String>,
    model: Option<String>,
    execution_mode: Option<String>,
    metadata: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppAgentRunCompleteRequest {
    status: Option<String>,
    output_message: Option<String>,
    error_message_masked: Option<String>,
    usage_fact_id: Option<String>,
    usage_json: Option<Value>,
    metadata: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppAgentRunStepCreateRequest {
    step_type: Option<String>,
    status: Option<String>,
    title: Option<String>,
    model: Option<String>,
    runtime_invocation_id: Option<String>,
    tool_name: Option<String>,
    input_json: Option<Value>,
    output_json: Option<Value>,
    usage_fact_id: Option<String>,
    usage_json: Option<Value>,
    metadata: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppAgentRunStepCompleteRequest {
    status: Option<String>,
    output_json: Option<Value>,
    error_message_masked: Option<String>,
    usage_fact_id: Option<String>,
    usage_json: Option<Value>,
    metadata: Option<Value>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppAgentRunEnvelope {
    item: AppAgentRunItem,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppAgentRunStepEnvelope {
    item: AppAgentRunStepItem,
}

struct EmptyAppAgentRunStore;

impl AppAgentRunStore for EmptyAppAgentRunStore {
    fn list_runs<'a>(
        &'a self,
        _subject: AppAgentRunSubject,
        _session_id: String,
        _page: i64,
        _page_size: i64,
    ) -> AppAgentRunFuture<'a, AppAgentRunList> {
        Box::pin(async { Ok(AppAgentRunList { items: Vec::new() }) })
    }

    fn get_run<'a>(
        &'a self,
        _subject: AppAgentRunSubject,
        _run_id: String,
    ) -> AppAgentRunFuture<'a, Option<AppAgentRunItem>> {
        Box::pin(async { Ok(None) })
    }

    fn create_run<'a>(
        &'a self,
        _command: CreateAppAgentRunCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app agent run store is unavailable without database configuration",
            ))
        })
    }

    fn complete_run<'a>(
        &'a self,
        _command: CompleteAppAgentRunCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app agent run store is unavailable without database configuration",
            ))
        })
    }

    fn list_steps<'a>(
        &'a self,
        _subject: AppAgentRunSubject,
        _run_id: String,
        _page: i64,
        _page_size: i64,
    ) -> AppAgentRunFuture<'a, AppAgentRunStepList> {
        Box::pin(async { Ok(AppAgentRunStepList { items: Vec::new() }) })
    }

    fn create_step<'a>(
        &'a self,
        _command: CreateAppAgentRunStepCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunStepItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app agent run store is unavailable without database configuration",
            ))
        })
    }

    fn complete_step<'a>(
        &'a self,
        _command: CompleteAppAgentRunStepCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunStepItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app agent run store is unavailable without database configuration",
            ))
        })
    }
}

pub fn app_agent_run_router() -> Router {
    app_agent_run_router_with_state(
        Arc::new(EmptyAppAgentRunStore),
        Arc::new(OsApiKeySecretGenerator),
        false,
    )
}

pub fn app_agent_run_router_with_store(
    store: Arc<dyn AppAgentRunStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    app_agent_run_router_with_state(store, entity_uuid_generator, true)
}

fn app_agent_run_router_with_state(
    store: Arc<dyn AppAgentRunStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route(
            "/app/v3/api/agents/sessions/{session_id}/runs",
            get(list_runs).post(create_run),
        )
        .route("/app/v3/api/agents/runs/{run_id}", get(get_run))
        .route(
            "/app/v3/api/agents/runs/{run_id}/steps",
            get(list_steps).post(create_step),
        )
        .route(
            "/app/v3/api/agents/runs/{run_id}/steps/{step_id}/complete",
            axum::routing::post(complete_step),
        )
        .route(
            "/app/v3/api/agents/runs/{run_id}/complete",
            axum::routing::post(complete_run),
        )
        .with_state(AppAgentRunState {
            store,
            entity_uuid_generator,
            require_subject,
        })
}

async fn list_runs(
    State(state): State<AppAgentRunState>,
    headers: HeaderMap,
    Path(session_id): Path<String>,
    Query(query): Query<AppAgentRunListQuery>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let session_id = match normalize_id(&session_id, "sessionId") {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    let (page, page_size) =
        normalize_page(query.page, query.page_size_camel, query.page_size_snake);
    match state
        .store
        .list_runs(subject, session_id, page, page_size)
        .await
    {
        Ok(list) => Json(PlusApiResult::success(list)).into_response(),
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) => app_agent_run_system_response("app agent runs are unavailable", error),
    }
}

async fn get_run(
    State(state): State<AppAgentRunState>,
    headers: HeaderMap,
    Path(run_id): Path<String>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let run_id = match normalize_id(&run_id, "runId") {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    match state.store.get_run(subject, run_id).await {
        Ok(Some(item)) => Json(PlusApiResult::success(item)).into_response(),
        Ok(None) => not_found("agent run was not found"),
        Err(error) => app_agent_run_system_response("app agent run is unavailable", error),
    }
}

async fn create_run(
    State(state): State<AppAgentRunState>,
    headers: HeaderMap,
    Path(session_id): Path<String>,
    Json(request): Json<AppAgentRunCreateRequest>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_create_run_command(&state, subject, session_id, request) {
        Ok(command) => command,
        Err(AppAgentRunBuildError::BadRequest(message)) => return bad_request(message),
        Err(AppAgentRunBuildError::System(error)) => {
            return app_agent_run_system_response("app agent run command is invalid", error);
        }
    };
    match state.store.create_run(command).await {
        Ok(item) => Json(PlusApiResult::success(AppAgentRunEnvelope { item })).into_response(),
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) if error.is_conflict() => conflict(error.to_string()),
        Err(error) => app_agent_run_system_response("app agent run is unavailable", error),
    }
}

async fn complete_run(
    State(state): State<AppAgentRunState>,
    headers: HeaderMap,
    Path(run_id): Path<String>,
    Json(request): Json<AppAgentRunCompleteRequest>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_complete_run_command(&state, subject, run_id, request) {
        Ok(command) => command,
        Err(AppAgentRunBuildError::BadRequest(message)) => return bad_request(message),
        Err(AppAgentRunBuildError::System(error)) => {
            return app_agent_run_system_response("app agent run command is invalid", error);
        }
    };
    match state.store.complete_run(command).await {
        Ok(item) => Json(PlusApiResult::success(AppAgentRunEnvelope { item })).into_response(),
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) if error.is_conflict() => conflict(error.to_string()),
        Err(error) => app_agent_run_system_response("app agent run is unavailable", error),
    }
}

async fn list_steps(
    State(state): State<AppAgentRunState>,
    headers: HeaderMap,
    Path(run_id): Path<String>,
    Query(query): Query<AppAgentRunListQuery>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let run_id = match normalize_id(&run_id, "runId") {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    let (page, page_size) =
        normalize_page(query.page, query.page_size_camel, query.page_size_snake);
    match state
        .store
        .list_steps(subject, run_id, page, page_size)
        .await
    {
        Ok(list) => Json(PlusApiResult::success(list)).into_response(),
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) => app_agent_run_system_response("app agent run steps are unavailable", error),
    }
}

async fn create_step(
    State(state): State<AppAgentRunState>,
    headers: HeaderMap,
    Path(run_id): Path<String>,
    Json(request): Json<AppAgentRunStepCreateRequest>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_create_step_command(&state, subject, run_id, request) {
        Ok(command) => command,
        Err(AppAgentRunBuildError::BadRequest(message)) => return bad_request(message),
        Err(AppAgentRunBuildError::System(error)) => {
            return app_agent_run_system_response("app agent run step command is invalid", error);
        }
    };
    match state.store.create_step(command).await {
        Ok(item) => Json(PlusApiResult::success(AppAgentRunStepEnvelope { item })).into_response(),
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) if error.is_conflict() => conflict(error.to_string()),
        Err(error) => app_agent_run_system_response("app agent run step is unavailable", error),
    }
}

async fn complete_step(
    State(state): State<AppAgentRunState>,
    headers: HeaderMap,
    Path((run_id, step_id)): Path<(String, String)>,
    Json(request): Json<AppAgentRunStepCompleteRequest>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_complete_step_command(&state, subject, run_id, step_id, request) {
        Ok(command) => command,
        Err(AppAgentRunBuildError::BadRequest(message)) => return bad_request(message),
        Err(AppAgentRunBuildError::System(error)) => {
            return app_agent_run_system_response("app agent run step command is invalid", error);
        }
    };
    match state.store.complete_step(command).await {
        Ok(item) => Json(PlusApiResult::success(AppAgentRunStepEnvelope { item })).into_response(),
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) if error.is_conflict() => conflict(error.to_string()),
        Err(error) => app_agent_run_system_response("app agent run step is unavailable", error),
    }
}

fn build_create_run_command(
    state: &AppAgentRunState,
    subject: AppAgentRunSubject,
    session_id: String,
    request: AppAgentRunCreateRequest,
) -> Result<CreateAppAgentRunCommand, AppAgentRunBuildError> {
    Ok(CreateAppAgentRunCommand {
        subject,
        session_id: normalize_id(&session_id, "sessionId")?,
        run_uuid: generate_entity_uuid(state)?,
        agent_id: normalize_required_id(request.agent_id.as_deref(), "agentId")?,
        agent_version_id: normalize_required_id(
            request.agent_version_id.as_deref(),
            "agentVersionId",
        )?,
        request_id: normalize_required_id(request.request_id.as_deref(), "requestId")?,
        trace_id: normalize_optional_id(request.trace_id.as_deref(), "traceId")?,
        source_surface: normalize_optional_text(
            request.source_surface.as_deref(),
            "sourceSurface",
            MAX_SOURCE_SURFACE_LEN,
        )?
        .unwrap_or_else(|| "agents".to_owned()),
        input_message: normalize_optional_text(
            request.input_message.as_deref(),
            "inputMessage",
            MAX_MESSAGE_LEN,
        )?,
        memory_space_id: normalize_optional_id(
            request.memory_space_id.as_deref(),
            "memorySpaceId",
        )?,
        runtime: normalize_optional_text(request.runtime.as_deref(), "runtime", MAX_KIND_LEN)?,
        model: normalize_optional_text(request.model.as_deref(), "model", MAX_MODEL_LEN)?,
        execution_mode: normalize_optional_text(
            request.execution_mode.as_deref(),
            "executionMode",
            MAX_KIND_LEN,
        )?
        .unwrap_or_else(|| "interactive".to_owned()),
        metadata: normalize_object(request.metadata, "metadata")?,
        requested_at: current_timestamp_string(),
    })
}

fn build_complete_run_command(
    state: &AppAgentRunState,
    subject: AppAgentRunSubject,
    run_id: String,
    request: AppAgentRunCompleteRequest,
) -> Result<CompleteAppAgentRunCommand, AppAgentRunBuildError> {
    let usage_json = normalize_object(request.usage_json, "usageJson")?;
    let usage = usage_from_json(&usage_json)?;
    let status = normalize_optional_text(request.status.as_deref(), "status", MAX_KIND_LEN)?
        .unwrap_or_else(|| "completed".to_owned());
    validate_run_status(&status)?;
    Ok(CompleteAppAgentRunCommand {
        subject,
        run_id: normalize_id(&run_id, "runId")?,
        usage_link_uuid: generate_entity_uuid(state)?,
        status,
        output_message: normalize_optional_text(
            request.output_message.as_deref(),
            "outputMessage",
            MAX_MESSAGE_LEN,
        )?,
        error_message_masked: normalize_optional_text(
            request.error_message_masked.as_deref(),
            "errorMessageMasked",
            MAX_ERROR_LEN,
        )?,
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cached_tokens: usage.cached_tokens,
        reasoning_tokens: usage.reasoning_tokens,
        total_tokens: usage.total_tokens,
        cost_amount: usage.cost_amount,
        currency: usage.currency,
        usage_fact_id: normalize_optional_positive_i64(
            request.usage_fact_id.as_deref(),
            "usageFactId",
        )?,
        usage_json,
        metadata: normalize_object(request.metadata, "metadata")?,
        requested_at: current_timestamp_string(),
    })
}

fn build_create_step_command(
    state: &AppAgentRunState,
    subject: AppAgentRunSubject,
    run_id: String,
    request: AppAgentRunStepCreateRequest,
) -> Result<CreateAppAgentRunStepCommand, AppAgentRunBuildError> {
    let usage_json = normalize_object(request.usage_json, "usageJson")?;
    let usage = usage_from_json(&usage_json)?;
    let status = normalize_optional_text(request.status.as_deref(), "status", MAX_KIND_LEN)?
        .unwrap_or_else(|| "running".to_owned());
    validate_run_status(&status)?;
    Ok(CreateAppAgentRunStepCommand {
        subject,
        run_id: normalize_id(&run_id, "runId")?,
        step_uuid: generate_entity_uuid(state)?,
        usage_link_uuid: generate_entity_uuid(state)?,
        step_type: normalize_optional_text(request.step_type.as_deref(), "stepType", MAX_KIND_LEN)?
            .unwrap_or_else(|| "model".to_owned()),
        status,
        title: normalize_optional_text(request.title.as_deref(), "title", MAX_TITLE_LEN)?,
        model: normalize_optional_text(request.model.as_deref(), "model", MAX_MODEL_LEN)?,
        runtime_invocation_id: normalize_optional_id(
            request.runtime_invocation_id.as_deref(),
            "runtimeInvocationId",
        )?,
        tool_name: normalize_optional_text(request.tool_name.as_deref(), "toolName", MAX_KIND_LEN)?,
        input_json: normalize_object(request.input_json, "inputJson")?,
        output_json: normalize_object(request.output_json, "outputJson")?,
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cached_tokens: usage.cached_tokens,
        reasoning_tokens: usage.reasoning_tokens,
        total_tokens: usage.total_tokens,
        cost_amount: usage.cost_amount,
        currency: usage.currency,
        usage_fact_id: normalize_optional_positive_i64(
            request.usage_fact_id.as_deref(),
            "usageFactId",
        )?,
        usage_json,
        metadata: normalize_object(request.metadata, "metadata")?,
        requested_at: current_timestamp_string(),
    })
}

fn build_complete_step_command(
    state: &AppAgentRunState,
    subject: AppAgentRunSubject,
    run_id: String,
    step_id: String,
    request: AppAgentRunStepCompleteRequest,
) -> Result<CompleteAppAgentRunStepCommand, AppAgentRunBuildError> {
    let usage_json = normalize_object(request.usage_json, "usageJson")?;
    let usage = usage_from_json(&usage_json)?;
    let status = normalize_optional_text(request.status.as_deref(), "status", MAX_KIND_LEN)?
        .unwrap_or_else(|| "completed".to_owned());
    validate_step_terminal_status(&status)?;
    Ok(CompleteAppAgentRunStepCommand {
        subject,
        run_id: normalize_id(&run_id, "runId")?,
        step_id: normalize_id(&step_id, "stepId")?,
        usage_link_uuid: generate_entity_uuid(state)?,
        status,
        output_json: normalize_object(request.output_json, "outputJson")?,
        error_message_masked: normalize_optional_text(
            request.error_message_masked.as_deref(),
            "errorMessageMasked",
            MAX_ERROR_LEN,
        )?,
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cached_tokens: usage.cached_tokens,
        reasoning_tokens: usage.reasoning_tokens,
        total_tokens: usage.total_tokens,
        cost_amount: usage.cost_amount,
        currency: usage.currency,
        usage_fact_id: normalize_optional_positive_i64(
            request.usage_fact_id.as_deref(),
            "usageFactId",
        )?,
        usage_json,
        metadata: normalize_object(request.metadata, "metadata")?,
        requested_at: current_timestamp_string(),
    })
}

fn required_subject(
    state: &AppAgentRunState,
    headers: &HeaderMap,
) -> Result<AppAgentRunSubject, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(AppAgentRunSubject {
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
                "trusted request subject is required for app agent runs",
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

fn normalize_required_id(value: Option<&str>, field: &str) -> Result<String, String> {
    normalize_optional_id(value, field)?.ok_or_else(|| format!("{field} is required"))
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

fn normalize_optional_positive_i64(
    value: Option<&str>,
    field: &str,
) -> Result<Option<i64>, String> {
    let Some(value) = normalize_optional_text(value, field, MAX_ID_LEN)? else {
        return Ok(None);
    };
    value
        .parse::<i64>()
        .ok()
        .filter(|value| *value > 0)
        .map(Some)
        .ok_or_else(|| format!("{field} must be a positive integer string"))
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

fn normalize_object(value: Option<Value>, field: &str) -> Result<Value, String> {
    match value {
        Some(Value::Object(_)) => Ok(value.unwrap()),
        Some(_) => Err(format!("{field} must be an object")),
        None => Ok(Value::Object(Map::new())),
    }
}

fn validate_run_status(status: &str) -> Result<(), String> {
    if matches!(
        status,
        "pending" | "queued" | "running" | "completed" | "failed" | "cancelled"
    ) {
        Ok(())
    } else {
        Err("status must be pending, queued, running, completed, failed, or cancelled".to_owned())
    }
}

fn validate_step_terminal_status(status: &str) -> Result<(), String> {
    if matches!(status, "completed" | "failed" | "cancelled") {
        Ok(())
    } else {
        Err("status must be completed, failed, or cancelled".to_owned())
    }
}

#[derive(Debug, Default)]
struct UsageSnapshot {
    input_tokens: Option<i64>,
    output_tokens: Option<i64>,
    cached_tokens: Option<i64>,
    reasoning_tokens: Option<i64>,
    total_tokens: Option<i64>,
    cost_amount: Option<String>,
    currency: Option<String>,
}

fn usage_from_json(value: &Value) -> Result<UsageSnapshot, String> {
    let input_tokens = optional_usage_i64(value, &["inputTokens", "input_tokens", "promptTokens"])?;
    let output_tokens = optional_usage_i64(
        value,
        &["outputTokens", "output_tokens", "completionTokens"],
    )?;
    let cached_tokens = optional_usage_i64(value, &["cachedTokens", "cached_tokens"])?;
    let reasoning_tokens = optional_usage_i64(value, &["reasoningTokens", "reasoning_tokens"])?;
    let total_tokens = optional_usage_i64(value, &["totalTokens", "total_tokens"])?
        .or_else(|| {
            Some(
                input_tokens.unwrap_or(0)
                    + output_tokens.unwrap_or(0)
                    + cached_tokens.unwrap_or(0)
                    + reasoning_tokens.unwrap_or(0),
            )
        })
        .filter(|value| *value > 0);
    let cost_amount = optional_usage_string(value, &["costAmount", "cost_amount", "cost"])?;
    let currency = optional_usage_string(value, &["currency"])?;
    Ok(UsageSnapshot {
        input_tokens,
        output_tokens,
        cached_tokens,
        reasoning_tokens,
        total_tokens,
        cost_amount,
        currency,
    })
}

fn optional_usage_i64(value: &Value, keys: &[&str]) -> Result<Option<i64>, String> {
    for key in keys {
        let Some(value) = value.get(key) else {
            continue;
        };
        let number = value
            .as_i64()
            .ok_or_else(|| format!("{key} must be an integer"))?;
        if number < 0 {
            return Err(format!("{key} must not be negative"));
        }
        return Ok(Some(number));
    }
    Ok(None)
}

fn optional_usage_string(value: &Value, keys: &[&str]) -> Result<Option<String>, String> {
    for key in keys {
        let Some(value) = value.get(key) else {
            continue;
        };
        let Some(value) = value.as_str() else {
            return Err(format!("{key} must be a string"));
        };
        return normalize_optional_text(Some(value), key, MAX_MONEY_LEN);
    }
    Ok(None)
}

fn generate_entity_uuid(state: &AppAgentRunState) -> Result<String, AppAgentRunBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(AppAgentRunBuildError::System)
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

fn app_agent_run_system_response(context: &str, error: DomainError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}

#[derive(Debug)]
enum AppAgentRunBuildError {
    BadRequest(String),
    System(DomainError),
}

impl From<String> for AppAgentRunBuildError {
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
