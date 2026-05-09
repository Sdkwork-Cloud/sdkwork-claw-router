use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Bytes;
use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post, put};
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
    AppInstalledSkillItem, AppSkillItem, AppSkillsCommandFuture, AppSkillsCommandStore,
    AppSkillsItems, AppSkillsQuery, AppSkillsReadFuture, AppSkillsReadStore, AppSkillsSubject,
    EnableAppSkillCommand, SetAppSkillEnabledCommand, UpdateAppSkillConfigCommand,
};

const MAX_CATALOG_PAGE_SIZE: i64 = 100;
const MAX_SKILL_CONFIG_BYTES: usize = 64 * 1024;

#[derive(Clone)]
struct AppSkillsState {
    read_store: Arc<dyn AppSkillsReadStore + Send + Sync>,
    command_store: Arc<dyn AppSkillsCommandStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppSkillsCatalogQuery {
    keyword: Option<String>,
    page_no: Option<i64>,
    page_size: Option<i64>,
    status: Option<String>,
    start_time: Option<String>,
    end_time: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppInstalledSkillEnvelope {
    item: AppInstalledSkillItem,
}

struct EmptyAppSkillsReadStore;

impl AppSkillsReadStore for EmptyAppSkillsReadStore {
    fn load_skills<'a>(
        &'a self,
        _query: AppSkillsQuery,
        _subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Vec<AppSkillItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn load_skill_by_id<'a>(
        &'a self,
        _skill_id: String,
        _subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Option<AppSkillItem>> {
        Box::pin(async { Ok(None) })
    }

    fn load_categories<'a>(
        &'a self,
        _subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Vec<String>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn load_user_skills<'a>(
        &'a self,
        _subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Vec<AppInstalledSkillItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }
}

struct EmptyAppSkillsCommandStore;

impl AppSkillsCommandStore for EmptyAppSkillsCommandStore {
    fn enable_skill<'a>(
        &'a self,
        _command: EnableAppSkillCommand,
    ) -> AppSkillsCommandFuture<'a, AppInstalledSkillItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app skills command store is unavailable without database configuration",
            ))
        })
    }

    fn set_skill_enabled<'a>(
        &'a self,
        _command: SetAppSkillEnabledCommand,
    ) -> AppSkillsCommandFuture<'a, AppInstalledSkillItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app skills command store is unavailable without database configuration",
            ))
        })
    }

    fn update_skill_config<'a>(
        &'a self,
        _command: UpdateAppSkillConfigCommand,
    ) -> AppSkillsCommandFuture<'a, AppInstalledSkillItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app skills command store is unavailable without database configuration",
            ))
        })
    }
}

pub fn app_skills_router() -> Router {
    app_skills_router_with_state(
        Arc::new(EmptyAppSkillsReadStore),
        Arc::new(EmptyAppSkillsCommandStore),
        Arc::new(OsApiKeySecretGenerator),
        false,
    )
}

pub fn app_skills_router_with_read_store(
    read_store: Arc<dyn AppSkillsReadStore + Send + Sync>,
) -> Router {
    app_skills_router_with_state(
        read_store,
        Arc::new(EmptyAppSkillsCommandStore),
        Arc::new(OsApiKeySecretGenerator),
        true,
    )
}

pub fn app_skills_router_with_store(
    read_store: Arc<dyn AppSkillsReadStore + Send + Sync>,
    command_store: Arc<dyn AppSkillsCommandStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    app_skills_router_with_state(read_store, command_store, entity_uuid_generator, true)
}

fn app_skills_router_with_state(
    read_store: Arc<dyn AppSkillsReadStore + Send + Sync>,
    command_store: Arc<dyn AppSkillsCommandStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route("/app/v3/api/skills", get(fetch_skills))
        .route("/app/v3/api/skills/my", get(fetch_user_skills))
        .route("/app/v3/api/skills/categories", get(fetch_categories))
        .route("/app/v3/api/skills/{skill_id}", get(fetch_skill_by_id))
        .route("/app/v3/api/skills/{skill_id}/enable", post(enable_skill))
        .route("/app/v3/api/skills/{skill_id}/disable", post(disable_skill))
        .route(
            "/app/v3/api/skills/{skill_id}/config",
            put(update_skill_config),
        )
        .with_state(AppSkillsState {
            read_store,
            command_store,
            entity_uuid_generator,
            require_subject,
        })
}

async fn fetch_skills(
    State(state): State<AppSkillsState>,
    headers: HeaderMap,
    Query(query): Query<AppSkillsCatalogQuery>,
) -> Response {
    let subject = match app_skills_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match validate_catalog_query(query) {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };

    match state.read_store.load_skills(query, subject).await {
        Ok(items) => Json(PlusApiResult::success(AppSkillsItems::new(items))).into_response(),
        Err(error) => app_skills_read_model_error(error),
    }
}

async fn fetch_user_skills(State(state): State<AppSkillsState>, headers: HeaderMap) -> Response {
    let subject = match app_skills_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_user_skills(subject).await {
        Ok(items) => Json(PlusApiResult::success(AppSkillsItems::new(items))).into_response(),
        Err(error) => app_skills_read_model_error(error),
    }
}

async fn fetch_skill_by_id(
    State(state): State<AppSkillsState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match app_skills_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match normalize_path_id(&skill_id, "skillId") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };

    match state.read_store.load_skill_by_id(skill_id, subject).await {
        Ok(Some(item)) => Json(PlusApiResult::success(item)).into_response(),
        Ok(None) => not_found("skill was not found"),
        Err(error) => app_skills_read_model_error(error),
    }
}

async fn enable_skill(
    State(state): State<AppSkillsState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match required_app_skills_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match normalize_path_id(&skill_id, "skillId") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let config = match parse_optional_config_body(&body) {
        Ok(config) => config,
        Err(message) => return bad_request(message),
    };
    let command = match build_enable_command(state.clone(), subject, skill_id, config) {
        Ok(command) => command,
        Err(error) => return app_skills_system_error("app skills command is invalid", error),
    };

    command_response(state.command_store.enable_skill(command).await)
}

async fn disable_skill(
    State(state): State<AppSkillsState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match required_app_skills_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match normalize_path_id(&skill_id, "skillId") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let command = SetAppSkillEnabledCommand {
        subject,
        skill_id,
        enabled: false,
        requested_at: current_timestamp_string(),
    };

    command_response(state.command_store.set_skill_enabled(command).await)
}

async fn update_skill_config(
    State(state): State<AppSkillsState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match required_app_skills_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match normalize_path_id(&skill_id, "skillId") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let Some(config) = (match parse_optional_config_body(&body) {
        Ok(config) => config,
        Err(message) => return bad_request(message),
    }) else {
        return bad_request("config must be provided".to_owned());
    };
    let command = UpdateAppSkillConfigCommand {
        subject,
        skill_id,
        config,
        requested_at: current_timestamp_string(),
    };

    command_response(state.command_store.update_skill_config(command).await)
}

async fn fetch_categories(State(state): State<AppSkillsState>, headers: HeaderMap) -> Response {
    let subject = match app_skills_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_categories(subject).await {
        Ok(items) => Json(PlusApiResult::success(AppSkillsItems::new(items))).into_response(),
        Err(error) => app_skills_read_model_error(error),
    }
}

fn build_enable_command(
    state: AppSkillsState,
    subject: AppSkillsSubject,
    skill_id: String,
    config: Option<Value>,
) -> Result<EnableAppSkillCommand, DomainError> {
    Ok(EnableAppSkillCommand {
        subject,
        skill_id,
        install_uuid: state.entity_uuid_generator.generate_entity_uuid()?,
        config,
        requested_at: current_timestamp_string(),
    })
}

fn validate_catalog_query(query: AppSkillsCatalogQuery) -> Result<AppSkillsQuery, String> {
    let page_no = validate_optional_positive(query.page_no, "pageNo")?;
    let page_size = validate_optional_positive(query.page_size, "pageSize")?;
    if page_size.unwrap_or(1) > MAX_CATALOG_PAGE_SIZE {
        return Err(format!("pageSize must be at most {MAX_CATALOG_PAGE_SIZE}"));
    }

    Ok(AppSkillsQuery {
        keyword: normalize_query_text(query.keyword),
        page_no,
        page_size,
        status: normalize_query_text(query.status),
        start_time: normalize_query_text(query.start_time),
        end_time: normalize_query_text(query.end_time),
    })
}

fn required_app_skills_subject(
    headers: &HeaderMap,
    require_subject: bool,
) -> Result<AppSkillsSubject, Response> {
    match app_skills_subject(headers, require_subject)? {
        Some(subject) => Ok(subject),
        None => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error(
                "4010",
                "trusted request subject is required for app skills command",
            )),
        )
            .into_response()),
    }
}

fn app_skills_subject(
    headers: &HeaderMap,
    require_subject: bool,
) -> Result<Option<AppSkillsSubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(AppSkillsSubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            user_id: subject.user_id,
        })),
        Err(error) if require_subject => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", error.to_string())),
        )
            .into_response()),
        Err(_) => Ok(None),
    }
}

fn parse_optional_config_body(body: &[u8]) -> Result<Option<Value>, String> {
    if body.len() > MAX_SKILL_CONFIG_BYTES {
        return Err(format!(
            "skill config body must be at most {MAX_SKILL_CONFIG_BYTES} bytes"
        ));
    }
    if body.iter().all(u8::is_ascii_whitespace) {
        return Ok(None);
    }
    let value = serde_json::from_slice::<Value>(body)
        .map_err(|error| format!("invalid skill config request body: {error}"))?;
    let object = value
        .as_object()
        .ok_or_else(|| "skill config request body must be a JSON object".to_owned())?;
    let config = match object.get("config") {
        Some(value) => value,
        None => &value,
    };
    validate_config_value(config).map(Some)
}

fn validate_config_value(value: &Value) -> Result<Value, String> {
    let Value::Object(object) = value else {
        return Err("config must be a JSON object".to_owned());
    };
    reject_nested_config_depth(object, 0)?;
    Ok(Value::Object(object.clone()))
}

fn reject_nested_config_depth(object: &Map<String, Value>, depth: usize) -> Result<(), String> {
    if depth > 8 {
        return Err("config nesting depth must be at most 8".to_owned());
    }
    for (key, value) in object {
        if key.trim().is_empty() || key.chars().count() > 128 {
            return Err("config keys must be non-empty and at most 128 characters".to_owned());
        }
        if key.chars().any(char::is_control) {
            return Err("config keys must not contain control characters".to_owned());
        }
        if key == "portal" {
            return Err("config.portal is reserved portal metadata".to_owned());
        }
        reject_nested_config_value(value, depth)?;
    }
    Ok(())
}

fn reject_nested_config_value(value: &Value, depth: usize) -> Result<(), String> {
    match value {
        Value::Object(child) => reject_nested_config_depth(child, depth + 1),
        Value::Array(items) => {
            if items.len() > 256 {
                return Err("config arrays must contain at most 256 items".to_owned());
            }
            for item in items {
                reject_nested_config_value(item, depth + 1)?;
            }
            Ok(())
        }
        Value::String(value) if value.chars().count() > 4096 => {
            Err("config string values must be at most 4096 characters".to_owned())
        }
        _ => Ok(()),
    }
}

fn validate_optional_positive(value: Option<i64>, field: &str) -> Result<Option<i64>, String> {
    match value {
        Some(value) if value <= 0 => Err(format!("{field} must be a positive integer")),
        value => Ok(value),
    }
}

fn normalize_query_text(value: Option<String>) -> Option<String> {
    value
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
}

fn normalize_path_id(value: &str, field: &str) -> Result<String, String> {
    let value = value.trim();
    if value.is_empty() {
        return Err(format!("{field} is required"));
    }
    if value.chars().count() > 128 {
        return Err(format!("{field} must be at most 128 characters"));
    }
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b'.' | b':'))
    {
        return Err(format!("{field} contains unsupported characters"));
    }
    Ok(value.to_owned())
}

fn bad_request(message: String) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(PlusApiResult::error("4001", message)),
    )
        .into_response()
}

fn not_found(message: &str) -> Response {
    (
        StatusCode::NOT_FOUND,
        Json(PlusApiResult::error("4004", message)),
    )
        .into_response()
}

fn command_response(result: Result<AppInstalledSkillItem, DomainError>) -> Response {
    match result {
        Ok(item) => {
            Json(PlusApiResult::success(AppInstalledSkillEnvelope { item })).into_response()
        }
        Err(error) if error.is_not_found() => not_found(&error.to_string()),
        Err(error) if error.is_conflict() => (
            StatusCode::CONFLICT,
            Json(PlusApiResult::error("4090", error.to_string())),
        )
            .into_response(),
        Err(error) => app_skills_system_error("app skills command store is unavailable", error),
    }
}

fn app_skills_read_model_error(error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error(
            "5000",
            format!("app skills read model is unavailable: {error}"),
        )),
    )
        .into_response()
}

fn app_skills_system_error(context: &str, error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}

fn current_timestamp_string() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
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
    let days = days + 719_468;
    let era = if days >= 0 { days } else { days - 146_096 } / 146_097;
    let day_of_era = days - era * 146_097;
    let year_of_era =
        (day_of_era - day_of_era / 1_460 + day_of_era / 36_524 - day_of_era / 146_096) / 365;
    let year = year_of_era + era * 400;
    let day_of_year = day_of_era - (365 * year_of_era + year_of_era / 4 - year_of_era / 100);
    let month_prime = (5 * day_of_year + 2) / 153;
    let day = day_of_year - (153 * month_prime + 2) / 5 + 1;
    let month = month_prime + if month_prime < 10 { 3 } else { -9 };
    let year = year + if month <= 2 { 1 } else { 0 };
    (year, month, day)
}
