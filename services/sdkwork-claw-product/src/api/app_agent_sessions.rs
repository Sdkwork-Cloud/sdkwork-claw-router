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
    AppAgentSessionFuture, AppAgentSessionItem, AppAgentSessionList, AppAgentSessionStore,
    AppAgentSessionSubject, CreateAppAgentSessionCommand,
};

const MAX_PAGE_SIZE: i64 = 100;
const MAX_ID_LEN: usize = 128;
const MAX_TITLE_LEN: usize = 256;
const MAX_KIND_LEN: usize = 64;
const MAX_SOURCE_SURFACE_LEN: usize = 64;
const MAX_RUNTIME_LEN: usize = 128;
const MAX_PATH_LEN: usize = 1024;
const MAX_POLICY_LEN: usize = 128;
const MAX_MODEL_LEN: usize = 128;

#[derive(Clone)]
struct AppAgentSessionState {
    store: Arc<dyn AppAgentSessionStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
}

#[derive(Debug, Deserialize)]
struct AppAgentSessionListQuery {
    #[serde(default)]
    page: Option<i64>,
    #[serde(default)]
    page_size: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppAgentSessionCreateRequest {
    agent_version_id: Option<String>,
    title: Option<String>,
    session_kind: Option<String>,
    source_surface: Option<String>,
    chat_conversation_id: Option<String>,
    memory_space_id: Option<String>,
    runtime: Option<String>,
    cwd: Option<String>,
    sandbox_policy: Option<String>,
    approval_policy: Option<String>,
    permission_mode: Option<String>,
    default_model: Option<String>,
    metadata: Option<Value>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppAgentSessionEnvelope {
    item: AppAgentSessionItem,
}

struct EmptyAppAgentSessionStore;

impl AppAgentSessionStore for EmptyAppAgentSessionStore {
    fn list_sessions<'a>(
        &'a self,
        _subject: AppAgentSessionSubject,
        _agent_id: String,
        _page: i64,
        _page_size: i64,
    ) -> AppAgentSessionFuture<'a, AppAgentSessionList> {
        Box::pin(async { Ok(AppAgentSessionList { items: Vec::new() }) })
    }

    fn get_session<'a>(
        &'a self,
        _subject: AppAgentSessionSubject,
        _session_id: String,
    ) -> AppAgentSessionFuture<'a, Option<AppAgentSessionItem>> {
        Box::pin(async { Ok(None) })
    }

    fn create_session<'a>(
        &'a self,
        _command: CreateAppAgentSessionCommand,
    ) -> AppAgentSessionFuture<'a, AppAgentSessionItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app agent session store is unavailable without database configuration",
            ))
        })
    }
}

pub fn app_agent_session_router() -> Router {
    app_agent_session_router_with_state(
        Arc::new(EmptyAppAgentSessionStore),
        Arc::new(OsApiKeySecretGenerator),
        false,
    )
}

pub fn app_agent_session_router_with_store(
    store: Arc<dyn AppAgentSessionStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    app_agent_session_router_with_state(store, entity_uuid_generator, true)
}

fn app_agent_session_router_with_state(
    store: Arc<dyn AppAgentSessionStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route(
            "/app/v3/api/agents/{agent_id}/sessions",
            get(list_sessions).post(create_session),
        )
        .route("/app/v3/api/agents/sessions/{session_id}", get(get_session))
        .with_state(AppAgentSessionState {
            store,
            entity_uuid_generator,
            require_subject,
        })
}

async fn list_sessions(
    State(state): State<AppAgentSessionState>,
    headers: HeaderMap,
    Path(agent_id): Path<String>,
    Query(query): Query<AppAgentSessionListQuery>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let agent_id = match normalize_id(&agent_id, "agentId") {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    let (page, page_size) = normalize_page(query);
    match state
        .store
        .list_sessions(subject, agent_id, page, page_size)
        .await
    {
        Ok(list) => Json(PlusApiResult::success(list)).into_response(),
        Err(error) => {
            app_agent_session_system_response("app agent sessions are unavailable", error)
        }
    }
}

async fn get_session(
    State(state): State<AppAgentSessionState>,
    headers: HeaderMap,
    Path(session_id): Path<String>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let session_id = match normalize_id(&session_id, "sessionId") {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    match state.store.get_session(subject, session_id).await {
        Ok(Some(item)) => Json(PlusApiResult::success(item)).into_response(),
        Ok(None) => not_found("agent session was not found"),
        Err(error) => app_agent_session_system_response("app agent session is unavailable", error),
    }
}

async fn create_session(
    State(state): State<AppAgentSessionState>,
    headers: HeaderMap,
    Path(agent_id): Path<String>,
    Json(request): Json<AppAgentSessionCreateRequest>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_create_session_command(&state, subject, agent_id, request) {
        Ok(command) => command,
        Err(AppAgentSessionBuildError::BadRequest(message)) => return bad_request(message),
        Err(AppAgentSessionBuildError::System(error)) => {
            return app_agent_session_system_response(
                "app agent session command is invalid",
                error,
            );
        }
    };
    match state.store.create_session(command).await {
        Ok(item) => Json(PlusApiResult::success(AppAgentSessionEnvelope { item })).into_response(),
        Err(error) if error.is_conflict() => (
            StatusCode::CONFLICT,
            Json(PlusApiResult::error("4090", error.to_string())),
        )
            .into_response(),
        Err(error) => app_agent_session_system_response("app agent session is unavailable", error),
    }
}

fn build_create_session_command(
    state: &AppAgentSessionState,
    subject: AppAgentSessionSubject,
    agent_id: String,
    request: AppAgentSessionCreateRequest,
) -> Result<CreateAppAgentSessionCommand, AppAgentSessionBuildError> {
    Ok(CreateAppAgentSessionCommand {
        subject,
        agent_id: normalize_id(&agent_id, "agentId")?,
        agent_version_id: normalize_optional_id(
            request.agent_version_id.as_deref(),
            "agentVersionId",
        )?,
        session_uuid: generate_entity_uuid(state)?,
        title: normalize_optional_text(request.title.as_deref(), "title", MAX_TITLE_LEN)?,
        session_kind: normalize_optional_text(
            request.session_kind.as_deref(),
            "sessionKind",
            MAX_KIND_LEN,
        )?
        .unwrap_or_else(|| "chat".to_owned()),
        source_surface: normalize_optional_text(
            request.source_surface.as_deref(),
            "sourceSurface",
            MAX_SOURCE_SURFACE_LEN,
        )?
        .unwrap_or_else(|| "agents".to_owned()),
        chat_conversation_id: normalize_optional_id(
            request.chat_conversation_id.as_deref(),
            "chatConversationId",
        )?,
        memory_space_id: normalize_optional_id(
            request.memory_space_id.as_deref(),
            "memorySpaceId",
        )?,
        runtime: normalize_optional_text(request.runtime.as_deref(), "runtime", MAX_RUNTIME_LEN)?,
        cwd: normalize_optional_text(request.cwd.as_deref(), "cwd", MAX_PATH_LEN)?,
        sandbox_policy: normalize_optional_text(
            request.sandbox_policy.as_deref(),
            "sandboxPolicy",
            MAX_POLICY_LEN,
        )?,
        approval_policy: normalize_optional_text(
            request.approval_policy.as_deref(),
            "approvalPolicy",
            MAX_POLICY_LEN,
        )?,
        permission_mode: normalize_optional_text(
            request.permission_mode.as_deref(),
            "permissionMode",
            MAX_POLICY_LEN,
        )?,
        default_model: normalize_optional_text(
            request.default_model.as_deref(),
            "defaultModel",
            MAX_MODEL_LEN,
        )?,
        metadata: normalize_metadata(request.metadata)?,
        requested_at: current_timestamp_string(),
    })
}

fn required_subject(
    state: &AppAgentSessionState,
    headers: &HeaderMap,
) -> Result<AppAgentSessionSubject, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(AppAgentSessionSubject {
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
                "trusted request subject is required for app agent sessions",
            )),
        )
            .into_response()),
    }
}

fn normalize_page(query: AppAgentSessionListQuery) -> (i64, i64) {
    let page = query.page.unwrap_or(1).max(1);
    let page_size = query.page_size.unwrap_or(30).max(1).min(MAX_PAGE_SIZE);
    (page, page_size)
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

fn normalize_metadata(value: Option<Value>) -> Result<Value, String> {
    match value {
        Some(Value::Object(_)) => Ok(value.unwrap()),
        Some(_) => Err("metadata must be an object".to_owned()),
        None => Ok(Value::Object(Map::new())),
    }
}

fn generate_entity_uuid(state: &AppAgentSessionState) -> Result<String, AppAgentSessionBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(AppAgentSessionBuildError::System)
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

fn app_agent_session_system_response(context: &str, error: DomainError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}

#[derive(Debug)]
enum AppAgentSessionBuildError {
    BadRequest(String),
    System(DomainError),
}

impl From<String> for AppAgentSessionBuildError {
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
