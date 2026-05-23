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
    AppAgentItem, AppAgentItems, AppAgentRegistryFuture, AppAgentRegistryQuery,
    AppAgentRegistryStore, AppAgentRegistrySubject, CreateAppAgentCommand,
};

const MAX_AGENT_NAME_LEN: usize = 128;
const MAX_AGENT_CODE_LEN: usize = 96;
const MAX_AGENT_DESCRIPTION_LEN: usize = 1024;
const MAX_MODEL_LEN: usize = 128;
const MAX_SYSTEM_PROMPT_LEN: usize = 32 * 1024;
const MAX_POLICY_DEPTH: usize = 8;
const MAX_POLICY_KEYS: usize = 256;
const MAX_PAGE_SIZE: i64 = 100;
const IDEMPOTENCY_KEY_HEADER: &str = "Idempotency-Key";
const REQUEST_ID_HEADER: &str = "X-Request-Id";

#[derive(Clone)]
struct AppAgentRegistryState {
    store: Arc<dyn AppAgentRegistryStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppAgentRegistryListQuery {
    q: Option<String>,
    page: Option<i64>,
    #[serde(rename = "pageSize")]
    page_size_camel: Option<i64>,
    #[serde(rename = "page_size")]
    page_size_snake: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppAgentCreateRequest {
    name: Option<String>,
    code: Option<String>,
    description: Option<String>,
    model: Option<String>,
    system_prompt: Option<String>,
    tool_policy: Option<Value>,
    memory_policy: Option<Value>,
    mcp_policy: Option<Value>,
    skill_policy: Option<Value>,
    runtime_policy: Option<Value>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppAgentItemEnvelope {
    item: AppAgentItem,
}

struct EmptyAppAgentRegistryStore;

impl AppAgentRegistryStore for EmptyAppAgentRegistryStore {
    fn list_agents<'a>(
        &'a self,
        _subject: AppAgentRegistrySubject,
        _query: AppAgentRegistryQuery,
    ) -> AppAgentRegistryFuture<'a, Vec<AppAgentItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn get_agent<'a>(
        &'a self,
        _subject: AppAgentRegistrySubject,
        _agent_id: String,
    ) -> AppAgentRegistryFuture<'a, Option<AppAgentItem>> {
        Box::pin(async { Ok(None) })
    }

    fn create_agent<'a>(
        &'a self,
        _command: CreateAppAgentCommand,
    ) -> AppAgentRegistryFuture<'a, AppAgentItem> {
        Box::pin(async {
            Err(DomainError::new(
                "app agent registry store is unavailable without database configuration",
            ))
        })
    }
}

pub fn app_agent_registry_router() -> Router {
    app_agent_registry_router_with_state(
        Arc::new(EmptyAppAgentRegistryStore),
        Arc::new(OsApiKeySecretGenerator),
        false,
    )
}

pub fn app_agent_registry_router_with_store(
    store: Arc<dyn AppAgentRegistryStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    app_agent_registry_router_with_state(store, entity_uuid_generator, true)
}

fn app_agent_registry_router_with_state(
    store: Arc<dyn AppAgentRegistryStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route("/app/v3/api/agents", get(list_agents).post(create_agent))
        .route("/app/v3/api/agents/{agent_id}", get(get_agent))
        .with_state(AppAgentRegistryState {
            store,
            entity_uuid_generator,
            require_subject,
        })
}

async fn list_agents(
    State(state): State<AppAgentRegistryState>,
    headers: HeaderMap,
    Query(query): Query<AppAgentRegistryListQuery>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match normalize_query(query) {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };

    match state.store.list_agents(subject, query).await {
        Ok(items) => Json(PlusApiResult::success(AppAgentItems::new(items))).into_response(),
        Err(error) => {
            app_agent_registry_system_response("app agent registry is unavailable", error)
        }
    }
}

async fn get_agent(
    State(state): State<AppAgentRegistryState>,
    headers: HeaderMap,
    Path(agent_id): Path<String>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let agent_id = match normalize_path_id(&agent_id, "agentId") {
        Ok(agent_id) => agent_id,
        Err(message) => return bad_request(message),
    };

    match state.store.get_agent(subject, agent_id).await {
        Ok(Some(item)) => Json(PlusApiResult::success(item)).into_response(),
        Ok(None) => not_found("agent was not found"),
        Err(error) => {
            app_agent_registry_system_response("app agent registry is unavailable", error)
        }
    }
}

async fn create_agent(
    State(state): State<AppAgentRegistryState>,
    headers: HeaderMap,
    Json(request): Json<AppAgentCreateRequest>,
) -> Response {
    let subject = match required_subject(&state, &headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_create_command(&state, &headers, subject, request) {
        Ok(command) => command,
        Err(AppAgentRegistryBuildError::BadRequest(message)) => return bad_request(message),
        Err(AppAgentRegistryBuildError::System(error)) => {
            return app_agent_registry_system_response("app agent command is invalid", error);
        }
    };

    match state.store.create_agent(command).await {
        Ok(item) => Json(PlusApiResult::success(AppAgentItemEnvelope { item })).into_response(),
        Err(error) if error.is_conflict() => (
            StatusCode::CONFLICT,
            Json(PlusApiResult::error("4090", error.to_string())),
        )
            .into_response(),
        Err(error) => {
            app_agent_registry_system_response("app agent registry is unavailable", error)
        }
    }
}

fn build_create_command(
    state: &AppAgentRegistryState,
    headers: &HeaderMap,
    subject: AppAgentRegistrySubject,
    request: AppAgentCreateRequest,
) -> Result<CreateAppAgentCommand, AppAgentRegistryBuildError> {
    let name = normalize_required_text(request.name.as_deref(), "agent name", MAX_AGENT_NAME_LEN)?;
    let agent_code = match request.code.as_deref() {
        Some(value) => normalize_agent_code(value)?,
        None => generated_agent_code(&name),
    };
    let description = normalize_optional_text(
        request.description.as_deref(),
        "agent description",
        MAX_AGENT_DESCRIPTION_LEN,
    )?;
    let model = normalize_optional_text(request.model.as_deref(), "agent model", MAX_MODEL_LEN)?;
    let system_prompt = normalize_optional_text(
        request.system_prompt.as_deref(),
        "agent systemPrompt",
        MAX_SYSTEM_PROMPT_LEN,
    )?;
    let tool_policy = normalize_policy(request.tool_policy, "toolPolicy")?;
    let memory_policy = normalize_policy(request.memory_policy, "memoryPolicy")?;
    let mcp_policy = normalize_policy(request.mcp_policy, "mcpPolicy")?;
    let skill_policy = normalize_policy(request.skill_policy, "skillPolicy")?;
    let runtime_policy = normalize_policy(request.runtime_policy, "runtimePolicy")?;
    let idempotency_key = normalize_idempotency_key(headers)?;
    let request_id = normalize_request_id(headers, state)?;
    let agent_uuid = generate_entity_uuid(state)?;
    let version_uuid = generate_entity_uuid(state)?;
    Ok(CreateAppAgentCommand {
        subject,
        agent_uuid,
        version_uuid,
        idempotency_key,
        request_id,
        agent_code,
        name,
        description,
        model,
        system_prompt,
        tool_policy,
        memory_policy,
        mcp_policy,
        skill_policy,
        runtime_policy,
        requested_at: current_timestamp_string(),
    })
}

fn normalize_idempotency_key(headers: &HeaderMap) -> Result<String, AppAgentRegistryBuildError> {
    let value = header_value(headers, IDEMPOTENCY_KEY_HEADER).ok_or_else(|| {
        AppAgentRegistryBuildError::BadRequest("Idempotency-Key header is required".to_owned())
    })?;
    validate_request_token(value, "Idempotency-Key")
}

fn normalize_request_id(
    headers: &HeaderMap,
    state: &AppAgentRegistryState,
) -> Result<String, AppAgentRegistryBuildError> {
    if let Some(value) = header_value(headers, REQUEST_ID_HEADER) {
        return validate_request_token(value, "X-Request-Id");
    }
    generate_entity_uuid(state)
}

fn header_value<'a>(headers: &'a HeaderMap, name: &str) -> Option<&'a str> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .filter(|value| !value.is_empty())
}

fn validate_request_token(value: &str, field: &str) -> Result<String, AppAgentRegistryBuildError> {
    if value.chars().count() > 128 {
        return Err(AppAgentRegistryBuildError::BadRequest(format!(
            "{field} must be at most 128 characters"
        )));
    }
    if !value.bytes().all(|byte| (0x21..=0x7e).contains(&byte)) {
        return Err(AppAgentRegistryBuildError::BadRequest(format!(
            "{field} must contain only visible ASCII characters"
        )));
    }
    Ok(value.to_owned())
}

fn required_subject(
    state: &AppAgentRegistryState,
    headers: &HeaderMap,
) -> Result<AppAgentRegistrySubject, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(AppAgentRegistrySubject {
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
                "trusted request subject is required for app agent registry",
            )),
        )
            .into_response()),
    }
}

fn normalize_query(query: AppAgentRegistryListQuery) -> Result<AppAgentRegistryQuery, String> {
    let page_no = normalize_optional_positive_i64(query.page, "page")?;
    let requested_page_size = query.page_size_snake.or(query.page_size_camel);
    let page_size = normalize_optional_positive_i64(requested_page_size, "pageSize")?;
    if page_size.unwrap_or(1) > MAX_PAGE_SIZE {
        return Err(format!("pageSize must be at most {MAX_PAGE_SIZE}"));
    }
    Ok(AppAgentRegistryQuery {
        keyword: normalize_query_text(query.q.as_deref(), "q", 128)?,
        page_no,
        page_size,
    })
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

fn normalize_required_text(
    value: Option<&str>,
    field: &str,
    max_len: usize,
) -> Result<String, AppAgentRegistryBuildError> {
    normalize_optional_text(value, field, max_len)?
        .ok_or_else(|| AppAgentRegistryBuildError::BadRequest(format!("{field} is required")))
}

fn normalize_optional_text(
    value: Option<&str>,
    field: &str,
    max_len: usize,
) -> Result<Option<String>, AppAgentRegistryBuildError> {
    let Some(value) = value.map(str::trim).filter(|value| !value.is_empty()) else {
        return Ok(None);
    };
    if value.chars().count() > max_len {
        return Err(AppAgentRegistryBuildError::BadRequest(format!(
            "{field} must be at most {max_len} characters"
        )));
    }
    if value.chars().any(char::is_control) {
        return Err(AppAgentRegistryBuildError::BadRequest(format!(
            "{field} must not contain control characters"
        )));
    }
    Ok(Some(value.to_owned()))
}

fn normalize_agent_code(value: &str) -> Result<String, AppAgentRegistryBuildError> {
    let value = generated_agent_code(value);
    if value.is_empty() {
        return Err(AppAgentRegistryBuildError::BadRequest(
            "agent code is required".to_owned(),
        ));
    }
    Ok(value)
}

fn generated_agent_code(value: &str) -> String {
    let normalized = value
        .trim()
        .chars()
        .map(|ch| {
            if ch.is_ascii_alphanumeric() {
                ch.to_ascii_lowercase()
            } else {
                '-'
            }
        })
        .collect::<String>()
        .split('-')
        .filter(|part| !part.is_empty())
        .collect::<Vec<_>>()
        .join("-");
    let slug: String = normalized.chars().take(MAX_AGENT_CODE_LEN).collect();
    if slug.is_empty() {
        format!("agent-{:016x}", seahash(value))
    } else {
        slug
    }
}

fn normalize_policy(
    value: Option<Value>,
    field: &str,
) -> Result<Value, AppAgentRegistryBuildError> {
    let value = value.unwrap_or_else(|| Value::Object(Map::new()));
    validate_policy_value(&value, field, 0)?;
    Ok(value)
}

fn validate_policy_value(
    value: &Value,
    field: &str,
    depth: usize,
) -> Result<(), AppAgentRegistryBuildError> {
    if depth > MAX_POLICY_DEPTH {
        return Err(AppAgentRegistryBuildError::BadRequest(format!(
            "{field} nesting depth must be at most {MAX_POLICY_DEPTH}"
        )));
    }
    match value {
        Value::Object(object) => {
            if object.len() > MAX_POLICY_KEYS {
                return Err(AppAgentRegistryBuildError::BadRequest(format!(
                    "{field} must contain at most {MAX_POLICY_KEYS} keys"
                )));
            }
            for (key, child) in object {
                if key.trim().is_empty() || key.chars().count() > 128 {
                    return Err(AppAgentRegistryBuildError::BadRequest(format!(
                        "{field} keys must be non-empty and at most 128 characters"
                    )));
                }
                if key.chars().any(char::is_control) {
                    return Err(AppAgentRegistryBuildError::BadRequest(format!(
                        "{field} keys must not contain control characters"
                    )));
                }
                validate_policy_value(child, field, depth + 1)?;
            }
            Ok(())
        }
        Value::Array(items) => {
            if items.len() > MAX_POLICY_KEYS {
                return Err(AppAgentRegistryBuildError::BadRequest(format!(
                    "{field} arrays must contain at most {MAX_POLICY_KEYS} items"
                )));
            }
            for item in items {
                validate_policy_value(item, field, depth + 1)?;
            }
            Ok(())
        }
        Value::String(value) if value.chars().count() > 4096 => {
            Err(AppAgentRegistryBuildError::BadRequest(format!(
                "{field} string values must be at most 4096 characters"
            )))
        }
        _ => Ok(()),
    }
}

fn normalize_optional_positive_i64(value: Option<i64>, field: &str) -> Result<Option<i64>, String> {
    match value {
        Some(value) if value <= 0 => Err(format!("{field} must be a positive integer")),
        value => Ok(value),
    }
}

fn normalize_query_text(
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
    if value.chars().any(char::is_control) {
        return Err(format!("{field} must not contain control characters"));
    }
    Ok(Some(value.to_owned()))
}

fn seahash(value: &str) -> u64 {
    let mut hash = 0xcbf29ce484222325u64;
    for byte in value.as_bytes() {
        hash ^= u64::from(*byte);
        hash = hash.wrapping_mul(0x100000001b3);
    }
    hash
}

fn generate_entity_uuid(
    state: &AppAgentRegistryState,
) -> Result<String, AppAgentRegistryBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(AppAgentRegistryBuildError::System)
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
        Json(PlusApiResult::error("4004", message.to_owned())),
    )
        .into_response()
}

fn app_agent_registry_system_response(context: &str, error: DomainError) -> Response {
    tracing::error!(error = %error, context, "app agent registry API failed");
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", context.to_owned())),
    )
        .into_response()
}

#[derive(Debug)]
enum AppAgentRegistryBuildError {
    BadRequest(String),
    System(DomainError),
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
