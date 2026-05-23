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
    AppMemoryEntryItem, AppMemoryEntryList, AppMemoryFuture, AppMemorySpaceItem,
    AppMemorySpaceList, AppMemoryStore, AppMemorySubject, CreateAppMemoryEntryCommand,
    CreateAppMemorySpaceCommand,
};

const MAX_PAGE_SIZE: i64 = 100;
const MAX_ID_LEN: usize = 128;
const MAX_TITLE_LEN: usize = 256;
const MAX_KIND_LEN: usize = 64;
const MAX_OWNER_LEN: usize = 128;
const MAX_SUBJECT_KEY_LEN: usize = 256;
const MAX_CONTENT_LEN: usize = 64 * 1024;
const MAX_DECIMAL_LEN: usize = 32;

#[derive(Clone)]
struct AppMemoryState {
    store: Arc<dyn AppMemoryStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppMemoryListQuery {
    page: Option<i64>,
    #[serde(rename = "pageSize")]
    page_size_camel: Option<i64>,
    #[serde(rename = "page_size")]
    page_size_snake: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppMemoryCreateSpaceRequest {
    title: Option<String>,
    space_type: Option<String>,
    owner_type: Option<String>,
    owner_id: Option<String>,
    memory_enabled: Option<bool>,
    auto_extract_enabled: Option<bool>,
    auto_recall_enabled: Option<bool>,
    review_required: Option<bool>,
    max_injected_tokens: Option<i64>,
    retention_policy: Option<Value>,
    sensitivity_policy: Option<Value>,
    metadata: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppMemoryCreateEntryRequest {
    memory_type: Option<String>,
    subject_type: Option<String>,
    subject_key: Option<String>,
    content: Option<String>,
    content_json: Option<Value>,
    source_kind: Option<String>,
    source_conversation_id: Option<String>,
    source_turn_id: Option<String>,
    source_item_id: Option<String>,
    source_invocation_id: Option<String>,
    importance_score: Option<String>,
    confidence_score: Option<String>,
    sensitivity_level: Option<String>,
    trust_level: Option<String>,
    status: Option<String>,
    metadata: Option<Value>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppMemorySpaceEnvelope {
    item: AppMemorySpaceItem,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppMemoryEntryEnvelope {
    item: AppMemoryEntryItem,
}

struct EmptyAppMemoryStore;

impl AppMemoryStore for EmptyAppMemoryStore {
    fn list_spaces<'a>(
        &'a self,
        _subject: AppMemorySubject,
        _page: i64,
        _page_size: i64,
    ) -> AppMemoryFuture<'a, AppMemorySpaceList> {
        Box::pin(async { Ok(AppMemorySpaceList { items: Vec::new() }) })
    }

    fn get_space<'a>(
        &'a self,
        _subject: AppMemorySubject,
        _space_id: String,
    ) -> AppMemoryFuture<'a, Option<AppMemorySpaceItem>> {
        Box::pin(async { Ok(None) })
    }

    fn create_space<'a>(
        &'a self,
        _command: CreateAppMemorySpaceCommand,
    ) -> AppMemoryFuture<'a, AppMemorySpaceItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app memory store is unavailable without database configuration",
            ))
        })
    }

    fn list_entries<'a>(
        &'a self,
        _subject: AppMemorySubject,
        _space_id: String,
        _page: i64,
        _page_size: i64,
    ) -> AppMemoryFuture<'a, AppMemoryEntryList> {
        Box::pin(async { Ok(AppMemoryEntryList { items: Vec::new() }) })
    }

    fn get_entry<'a>(
        &'a self,
        _subject: AppMemorySubject,
        _entry_id: String,
    ) -> AppMemoryFuture<'a, Option<AppMemoryEntryItem>> {
        Box::pin(async { Ok(None) })
    }

    fn create_entry<'a>(
        &'a self,
        _command: CreateAppMemoryEntryCommand,
    ) -> AppMemoryFuture<'a, AppMemoryEntryItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app memory store is unavailable without database configuration",
            ))
        })
    }
}

pub fn app_memory_router() -> Router {
    app_memory_router_with_state(
        Arc::new(EmptyAppMemoryStore),
        Arc::new(OsApiKeySecretGenerator),
        false,
    )
}

pub fn app_memory_router_with_store(
    store: Arc<dyn AppMemoryStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    app_memory_router_with_state(store, entity_uuid_generator, true)
}

fn app_memory_router_with_state(
    store: Arc<dyn AppMemoryStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route(
            "/app/v3/api/memory/spaces",
            get(list_spaces).post(create_space),
        )
        .route("/app/v3/api/memory/spaces/{space_id}", get(get_space))
        .route(
            "/app/v3/api/memory/spaces/{space_id}/entries",
            get(list_entries).post(create_entry),
        )
        .route("/app/v3/api/memory/entries/{entry_id}", get(get_entry))
        .with_state(AppMemoryState {
            store,
            entity_uuid_generator,
            require_subject,
        })
}

async fn list_spaces(
    State(state): State<AppMemoryState>,
    headers: HeaderMap,
    Query(query): Query<AppMemoryListQuery>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let (page, page_size) = normalize_page(query);
    match state.store.list_spaces(subject, page, page_size).await {
        Ok(list) => Json(PlusApiResult::success(list)).into_response(),
        Err(error) => app_memory_system_response("app memory spaces are unavailable", error),
    }
}

async fn get_space(
    State(state): State<AppMemoryState>,
    headers: HeaderMap,
    Path(space_id): Path<String>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let space_id = match normalize_id(&space_id, "spaceId") {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    match state.store.get_space(subject, space_id).await {
        Ok(Some(item)) => Json(PlusApiResult::success(item)).into_response(),
        Ok(None) => not_found("memory space was not found"),
        Err(error) => app_memory_system_response("app memory space is unavailable", error),
    }
}

async fn create_space(
    State(state): State<AppMemoryState>,
    headers: HeaderMap,
    Json(request): Json<AppMemoryCreateSpaceRequest>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_create_space_command(&state, subject, request) {
        Ok(command) => command,
        Err(AppMemoryBuildError::BadRequest(message)) => return bad_request(message),
        Err(AppMemoryBuildError::System(error)) => {
            return app_memory_system_response("app memory space command is invalid", error);
        }
    };
    match state.store.create_space(command).await {
        Ok(item) => Json(PlusApiResult::success(AppMemorySpaceEnvelope { item })).into_response(),
        Err(error) if error.is_conflict() => (
            StatusCode::CONFLICT,
            Json(PlusApiResult::error("4090", error.to_string())),
        )
            .into_response(),
        Err(error) => app_memory_system_response("app memory space is unavailable", error),
    }
}

async fn list_entries(
    State(state): State<AppMemoryState>,
    headers: HeaderMap,
    Path(space_id): Path<String>,
    Query(query): Query<AppMemoryListQuery>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let space_id = match normalize_id(&space_id, "spaceId") {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    let (page, page_size) = normalize_page(query);
    match state
        .store
        .list_entries(subject, space_id, page, page_size)
        .await
    {
        Ok(list) => Json(PlusApiResult::success(list)).into_response(),
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) => app_memory_system_response("app memory entries are unavailable", error),
    }
}

async fn get_entry(
    State(state): State<AppMemoryState>,
    headers: HeaderMap,
    Path(entry_id): Path<String>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let entry_id = match normalize_id(&entry_id, "entryId") {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    match state.store.get_entry(subject, entry_id).await {
        Ok(Some(item)) => Json(PlusApiResult::success(item)).into_response(),
        Ok(None) => not_found("memory entry was not found"),
        Err(error) => app_memory_system_response("app memory entry is unavailable", error),
    }
}

async fn create_entry(
    State(state): State<AppMemoryState>,
    headers: HeaderMap,
    Path(space_id): Path<String>,
    Json(request): Json<AppMemoryCreateEntryRequest>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_create_entry_command(&state, subject, space_id, request) {
        Ok(command) => command,
        Err(AppMemoryBuildError::BadRequest(message)) => return bad_request(message),
        Err(AppMemoryBuildError::System(error)) => {
            return app_memory_system_response("app memory entry command is invalid", error);
        }
    };
    match state.store.create_entry(command).await {
        Ok(item) => Json(PlusApiResult::success(AppMemoryEntryEnvelope { item })).into_response(),
        Err(error) if error.is_not_found() => not_found(error.to_string()),
        Err(error) if error.is_conflict() => (
            StatusCode::CONFLICT,
            Json(PlusApiResult::error("4090", error.to_string())),
        )
            .into_response(),
        Err(error) => app_memory_system_response("app memory entry is unavailable", error),
    }
}

fn build_create_space_command(
    state: &AppMemoryState,
    subject: AppMemorySubject,
    request: AppMemoryCreateSpaceRequest,
) -> Result<CreateAppMemorySpaceCommand, AppMemoryBuildError> {
    let max_injected_tokens = request.max_injected_tokens;
    if matches!(max_injected_tokens, Some(value) if value < 0) {
        return Err(AppMemoryBuildError::BadRequest(
            "maxInjectedTokens must not be negative".to_owned(),
        ));
    }
    Ok(CreateAppMemorySpaceCommand {
        subject,
        space_uuid: generate_entity_uuid(state)?,
        title: normalize_required_text(request.title.as_deref(), "title", MAX_TITLE_LEN)?,
        space_type: normalize_optional_text(
            request.space_type.as_deref(),
            "spaceType",
            MAX_KIND_LEN,
        )?
        .unwrap_or_else(|| "user".to_owned()),
        owner_type: normalize_optional_text(
            request.owner_type.as_deref(),
            "ownerType",
            MAX_KIND_LEN,
        )?,
        owner_id: normalize_optional_text(request.owner_id.as_deref(), "ownerId", MAX_OWNER_LEN)?,
        memory_enabled: request.memory_enabled.unwrap_or(true),
        auto_extract_enabled: request.auto_extract_enabled.unwrap_or(false),
        auto_recall_enabled: request.auto_recall_enabled.unwrap_or(true),
        review_required: request.review_required.unwrap_or(false),
        max_injected_tokens,
        retention_policy: normalize_object(request.retention_policy, "retentionPolicy")?,
        sensitivity_policy: normalize_object(request.sensitivity_policy, "sensitivityPolicy")?,
        metadata: normalize_metadata(request.metadata)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_create_entry_command(
    state: &AppMemoryState,
    subject: AppMemorySubject,
    space_id: String,
    request: AppMemoryCreateEntryRequest,
) -> Result<CreateAppMemoryEntryCommand, AppMemoryBuildError> {
    Ok(CreateAppMemoryEntryCommand {
        subject,
        space_id: normalize_id(&space_id, "spaceId")?,
        entry_uuid: generate_entity_uuid(state)?,
        event_uuid: generate_entity_uuid(state)?,
        memory_type: normalize_optional_text(
            request.memory_type.as_deref(),
            "memoryType",
            MAX_KIND_LEN,
        )?
        .unwrap_or_else(|| "fact".to_owned()),
        subject_type: normalize_optional_text(
            request.subject_type.as_deref(),
            "subjectType",
            MAX_KIND_LEN,
        )?,
        subject_key: normalize_optional_text(
            request.subject_key.as_deref(),
            "subjectKey",
            MAX_SUBJECT_KEY_LEN,
        )?,
        content_text: normalize_required_text(
            request.content.as_deref(),
            "content",
            MAX_CONTENT_LEN,
        )?,
        content_json: normalize_object(request.content_json, "contentJson")?,
        source_kind: normalize_optional_text(
            request.source_kind.as_deref(),
            "sourceKind",
            MAX_KIND_LEN,
        )?
        .unwrap_or_else(|| "manual".to_owned()),
        source_conversation_id: normalize_optional_id(
            request.source_conversation_id.as_deref(),
            "sourceConversationId",
        )?,
        source_turn_id: normalize_optional_id(request.source_turn_id.as_deref(), "sourceTurnId")?,
        source_item_id: normalize_optional_id(request.source_item_id.as_deref(), "sourceItemId")?,
        source_invocation_id: normalize_optional_id(
            request.source_invocation_id.as_deref(),
            "sourceInvocationId",
        )?,
        importance_score: normalize_optional_text(
            request.importance_score.as_deref(),
            "importanceScore",
            MAX_DECIMAL_LEN,
        )?,
        confidence_score: normalize_optional_text(
            request.confidence_score.as_deref(),
            "confidenceScore",
            MAX_DECIMAL_LEN,
        )?,
        sensitivity_level: normalize_optional_text(
            request.sensitivity_level.as_deref(),
            "sensitivityLevel",
            MAX_KIND_LEN,
        )?
        .unwrap_or_else(|| "standard".to_owned()),
        trust_level: normalize_optional_text(
            request.trust_level.as_deref(),
            "trustLevel",
            MAX_KIND_LEN,
        )?
        .unwrap_or_else(|| "observed".to_owned()),
        status: normalize_optional_text(request.status.as_deref(), "status", MAX_KIND_LEN)?
            .unwrap_or_else(|| "active".to_owned()),
        metadata: normalize_metadata(request.metadata)?,
        requested_at: current_timestamp_string(),
    })
}

fn required_subject(
    state: &AppMemoryState,
    headers: &HeaderMap,
) -> Result<AppMemorySubject, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(AppMemorySubject {
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
                "trusted request subject is required for app memory",
            )),
        )
            .into_response()),
    }
}

fn normalize_page(query: AppMemoryListQuery) -> (i64, i64) {
    let page = query.page.unwrap_or(1).max(1);
    let page_size = query
        .page_size_snake
        .or(query.page_size_camel)
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

fn generate_entity_uuid(state: &AppMemoryState) -> Result<String, AppMemoryBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(AppMemoryBuildError::System)
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

fn app_memory_system_response(context: &str, error: DomainError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}

#[derive(Debug)]
enum AppMemoryBuildError {
    BadRequest(String),
    System(DomainError),
}

impl From<String> for AppMemoryBuildError {
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
