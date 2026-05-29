use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Bytes;
use axum::extract::{Path, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, put};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::{Deserialize, Serialize};

use crate::api::request_id::{generate_server_request_id, RequestIdError};
use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::ports::{
    AdminChannelEndpointItem, AdminChannelEndpointStore, AdminChannelEndpointSubject,
    CreateAdminChannelEndpointCommand, ListAdminChannelEndpointsQuery,
    UpdateAdminChannelEndpointCommand,
};

const MAX_CODE_LEN: usize = 128;
const MAX_REGION_CODE_LEN: usize = 64;
const MAX_BASE_URL_LEN: usize = 512;
const MAX_TIMESTAMP_LEN: usize = 64;
const DEFAULT_PRIORITY: i64 = 100;
const DEFAULT_WEIGHT: i64 = 100;
const MAX_PRIORITY: i64 = 1_000_000;
const MAX_WEIGHT: i64 = 1_000_000;

#[derive(Clone)]
struct AdminChannelEndpointState {
    store: Arc<dyn AdminChannelEndpointStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminChannelEndpointsResponse {
    items: Vec<AdminChannelEndpointItemResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminChannelEndpointItemEnvelope {
    item: AdminChannelEndpointItemResponse,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminChannelEndpointItemResponse {
    id: String,
    channel_id: String,
    provider_code: String,
    channel_code: String,
    channel_type: String,
    vendor_code: String,
    region_code: String,
    api_endpoint_code: String,
    base_url: String,
    priority: i64,
    weight: i64,
    health_status: String,
    status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    effective_from: Option<String>,
    effective_to: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ChannelEndpointCreateRequest {
    channel_id: Option<ChannelEndpointId>,
    vendor_code: Option<String>,
    region_code: Option<String>,
    api_endpoint_code: Option<String>,
    base_url: Option<String>,
    priority: Option<i64>,
    weight: Option<i64>,
    status: Option<String>,
    effective_from: Option<String>,
    effective_to: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ChannelEndpointUpdateRequest {
    vendor_code: Option<String>,
    region_code: Option<String>,
    api_endpoint_code: Option<String>,
    base_url: Option<String>,
    priority: Option<i64>,
    weight: Option<i64>,
    status: Option<String>,
    #[serde(default)]
    effective_from: OptionalTextPatch,
    #[serde(default)]
    effective_to: OptionalTextPatch,
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum ChannelEndpointId {
    Number(i64),
    Text(String),
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum OptionalTextPatch {
    Missing,
    Null,
    Value(String),
}

impl Default for OptionalTextPatch {
    fn default() -> Self {
        Self::Missing
    }
}

impl<'de> Deserialize<'de> for OptionalTextPatch {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = Option::<String>::deserialize(deserializer)?;
        Ok(match value {
            Some(value) => Self::Value(value),
            None => Self::Null,
        })
    }
}

enum ChannelEndpointCommandBuildError {
    BadRequest(String),
    System(DomainError),
}

pub fn admin_channel_endpoint_router_with_store(
    store: Arc<dyn AdminChannelEndpointStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/integration/channel_endpoints",
            get(fetch_channel_endpoints).post(create_channel_endpoint),
        )
        .route(
            "/backend/v3/api/integration/channel_endpoints/{endpoint_id}",
            put(update_channel_endpoint),
        )
        .with_state(AdminChannelEndpointState {
            store,
            entity_uuid_generator,
        })
}

async fn fetch_channel_endpoints(
    State(state): State<AdminChannelEndpointState>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state
        .store
        .list_channel_endpoints(ListAdminChannelEndpointsQuery { subject })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AdminChannelEndpointsResponse {
            items: items.into_iter().map(to_item_response).collect(),
        }))
        .into_response(),
        Err(error) => {
            channel_endpoint_system_response("channel endpoint read model is unavailable", error)
        }
    }
}

async fn create_channel_endpoint(
    State(state): State<AdminChannelEndpointState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<ChannelEndpointCreateRequest>(&body, "channel endpoint") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_command(state.clone(), subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.create_channel_endpoint(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminChannelEndpointItemEnvelope {
            item: to_item_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("channel was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => {
            channel_endpoint_system_response("channel endpoint command store is unavailable", error)
        }
    }
}

async fn update_channel_endpoint(
    State(state): State<AdminChannelEndpointState>,
    Path(endpoint_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let endpoint_id = match parse_positive_id(&endpoint_id, "channel endpoint id") {
        Ok(endpoint_id) => endpoint_id,
        Err(message) => return bad_request(message),
    };
    let request =
        match parse_json_body::<ChannelEndpointUpdateRequest>(&body, "channel endpoint update") {
            Ok(request) => request,
            Err(message) => return bad_request(message),
        };
    let command = match build_update_command(state.clone(), subject, endpoint_id, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.update_channel_endpoint(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminChannelEndpointItemEnvelope {
            item: to_item_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("channel endpoint was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => {
            channel_endpoint_system_response("channel endpoint command store is unavailable", error)
        }
    }
}

fn resolve_subject(headers: &HeaderMap) -> Result<AdminChannelEndpointSubject, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| AdminChannelEndpointSubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            operator_id: subject.operator_id,
            operator_type: subject.operator_type,
        })
        .map_err(|error| {
            (
                StatusCode::UNAUTHORIZED,
                Json(PlusApiResult::error("4010", error.to_string())),
            )
                .into_response()
        })
}

fn to_item_response(item: AdminChannelEndpointItem) -> AdminChannelEndpointItemResponse {
    AdminChannelEndpointItemResponse {
        id: item.id.to_string(),
        channel_id: item.channel_id.to_string(),
        provider_code: item.provider_code,
        channel_code: item.channel_code,
        channel_type: item.channel_type,
        vendor_code: item.vendor_code,
        region_code: item.region_code,
        api_endpoint_code: item.api_endpoint_code,
        base_url: item.base_url,
        priority: item.priority,
        weight: item.weight,
        health_status: item.health_status,
        status: item.status,
        effective_from: item.effective_from,
        effective_to: item.effective_to,
    }
}

fn parse_json_body<T: for<'de> Deserialize<'de>>(body: &[u8], label: &str) -> Result<T, String> {
    if body.iter().all(u8::is_ascii_whitespace) {
        return Err(format!("{label} request body is required"));
    }
    serde_json::from_slice(body).map_err(|error| format!("invalid {label} request body: {error}"))
}

fn build_create_command(
    state: AdminChannelEndpointState,
    subject: AdminChannelEndpointSubject,
    request: ChannelEndpointCreateRequest,
) -> Result<CreateAdminChannelEndpointCommand, ChannelEndpointCommandBuildError> {
    Ok(CreateAdminChannelEndpointCommand {
        subject,
        endpoint_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        channel_id: required_request_id(request.channel_id, "channelId", "channel id")?,
        vendor_code: required_code(request.vendor_code, "vendorCode", MAX_CODE_LEN)?,
        region_code: required_code(request.region_code, "regionCode", MAX_REGION_CODE_LEN)?,
        api_endpoint_code: required_code(
            request.api_endpoint_code,
            "apiEndpointCode",
            MAX_CODE_LEN,
        )?,
        base_url: required_base_url(request.base_url)?,
        priority: positive_integer(
            request.priority.unwrap_or(DEFAULT_PRIORITY),
            "priority",
            MAX_PRIORITY,
        )?,
        weight: positive_integer(
            request.weight.unwrap_or(DEFAULT_WEIGHT),
            "weight",
            MAX_WEIGHT,
        )?,
        status: normalize_status(
            optional_text(request.status, "status", 32)?.unwrap_or_else(|| "active".to_owned()),
        )?,
        effective_from: optional_timestamp(request.effective_from, "effectiveFrom")?,
        effective_to: optional_timestamp(request.effective_to, "effectiveTo")?,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_command(
    state: AdminChannelEndpointState,
    subject: AdminChannelEndpointSubject,
    endpoint_id: i64,
    request: ChannelEndpointUpdateRequest,
) -> Result<UpdateAdminChannelEndpointCommand, ChannelEndpointCommandBuildError> {
    Ok(UpdateAdminChannelEndpointCommand {
        subject,
        endpoint_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        vendor_code: request
            .vendor_code
            .map(|value| code(value, "vendorCode", MAX_CODE_LEN))
            .transpose()?,
        region_code: request
            .region_code
            .map(|value| code(value, "regionCode", MAX_REGION_CODE_LEN))
            .transpose()?,
        api_endpoint_code: request
            .api_endpoint_code
            .map(|value| code(value, "apiEndpointCode", MAX_CODE_LEN))
            .transpose()?,
        base_url: request.base_url.map(base_url).transpose()?,
        priority: request
            .priority
            .map(|value| positive_integer(value, "priority", MAX_PRIORITY))
            .transpose()?,
        weight: request
            .weight
            .map(|value| positive_integer(value, "weight", MAX_WEIGHT))
            .transpose()?,
        status: request.status.map(normalize_status).transpose()?,
        effective_from: optional_timestamp_patch(request.effective_from, "effectiveFrom")?,
        effective_to: optional_timestamp_patch(request.effective_to, "effectiveTo")?,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn required_request_id(
    value: Option<ChannelEndpointId>,
    field_name: &str,
    label: &str,
) -> Result<i64, ChannelEndpointCommandBuildError> {
    let Some(value) = value else {
        return Err(ChannelEndpointCommandBuildError::BadRequest(format!(
            "{label} is required"
        )));
    };
    let id = match value {
        ChannelEndpointId::Number(id) => id,
        ChannelEndpointId::Text(value) => value.trim().parse::<i64>().map_err(|_| {
            ChannelEndpointCommandBuildError::BadRequest(format!(
                "{field_name} must be a positive integer"
            ))
        })?,
    };
    if id <= 0 {
        return Err(ChannelEndpointCommandBuildError::BadRequest(format!(
            "{field_name} must be a positive integer"
        )));
    }
    Ok(id)
}

fn required_code(
    value: Option<String>,
    field_name: &str,
    max_len: usize,
) -> Result<String, ChannelEndpointCommandBuildError> {
    code(
        required_text(value, field_name, field_name, max_len)?,
        field_name,
        max_len,
    )
}

fn code(
    value: String,
    field_name: &str,
    max_len: usize,
) -> Result<String, ChannelEndpointCommandBuildError> {
    let value = value.trim().to_ascii_lowercase();
    if value.is_empty() || value.len() > max_len {
        return Err(ChannelEndpointCommandBuildError::BadRequest(format!(
            "{field_name} is invalid"
        )));
    }
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'.' | b'-' | b'_' | b'*'))
    {
        return Err(ChannelEndpointCommandBuildError::BadRequest(format!(
            "{field_name} may only contain letters, numbers, ., -, _, and *"
        )));
    }
    Ok(value)
}

fn required_base_url(value: Option<String>) -> Result<String, ChannelEndpointCommandBuildError> {
    base_url(required_text(
        value,
        "baseUrl",
        "channel endpoint base URL",
        MAX_BASE_URL_LEN,
    )?)
}

fn base_url(value: String) -> Result<String, ChannelEndpointCommandBuildError> {
    let value = value.trim();
    if value.is_empty() || value.len() > MAX_BASE_URL_LEN {
        return Err(ChannelEndpointCommandBuildError::BadRequest(
            "baseUrl is invalid".to_owned(),
        ));
    }
    if !(value.starts_with("https://") || value.starts_with("http://")) {
        return Err(ChannelEndpointCommandBuildError::BadRequest(
            "baseUrl must start with http:// or https://".to_owned(),
        ));
    }
    if value.bytes().any(|byte| byte <= 0x20 || byte == 0x7f) {
        return Err(ChannelEndpointCommandBuildError::BadRequest(
            "baseUrl must not contain whitespace or control characters".to_owned(),
        ));
    }
    Ok(value.to_owned())
}

fn required_text(
    value: Option<String>,
    field_name: &str,
    label: &str,
    max_len: usize,
) -> Result<String, ChannelEndpointCommandBuildError> {
    optional_text(value, field_name, max_len)?
        .ok_or_else(|| ChannelEndpointCommandBuildError::BadRequest(format!("{label} is required")))
}

fn optional_text(
    value: Option<String>,
    field_name: &str,
    max_len: usize,
) -> Result<Option<String>, ChannelEndpointCommandBuildError> {
    let Some(value) = value else {
        return Ok(None);
    };
    let value = value.trim();
    if value.is_empty() {
        return Ok(None);
    }
    if value.len() > max_len {
        return Err(ChannelEndpointCommandBuildError::BadRequest(format!(
            "{field_name} must be at most {max_len} characters"
        )));
    }
    Ok(Some(value.to_owned()))
}

fn optional_timestamp(
    value: Option<String>,
    field_name: &str,
) -> Result<Option<String>, ChannelEndpointCommandBuildError> {
    let value = optional_text(value, field_name, MAX_TIMESTAMP_LEN)?;
    if let Some(value) = value.as_deref() {
        if value.bytes().any(|byte| byte < 0x20 || byte == 0x7f) {
            return Err(ChannelEndpointCommandBuildError::BadRequest(format!(
                "{field_name} must not contain control characters"
            )));
        }
    }
    Ok(value)
}

fn optional_timestamp_patch(
    value: OptionalTextPatch,
    field_name: &str,
) -> Result<Option<Option<String>>, ChannelEndpointCommandBuildError> {
    match value {
        OptionalTextPatch::Missing => Ok(None),
        OptionalTextPatch::Null => Ok(Some(None)),
        OptionalTextPatch::Value(value) => optional_timestamp(Some(value), field_name).map(Some),
    }
}

fn normalize_status(value: String) -> Result<String, ChannelEndpointCommandBuildError> {
    match value.trim().to_ascii_lowercase().as_str() {
        "active" | "disabled" | "inactive" => Ok(value.trim().to_ascii_lowercase()),
        _ => Err(ChannelEndpointCommandBuildError::BadRequest(
            "status must be one of active, disabled, inactive".to_owned(),
        )),
    }
}

fn positive_integer(
    value: i64,
    field_name: &str,
    max_value: i64,
) -> Result<i64, ChannelEndpointCommandBuildError> {
    if value < 1 || value > max_value {
        return Err(ChannelEndpointCommandBuildError::BadRequest(format!(
            "{field_name} must be between 1 and {max_value}"
        )));
    }
    Ok(value)
}

fn parse_positive_id(value: &str, field_name: &str) -> Result<i64, String> {
    let id = value
        .trim()
        .parse::<i64>()
        .map_err(|_| format!("{field_name} must be a positive integer"))?;
    if id <= 0 {
        return Err(format!("{field_name} must be a positive integer"));
    }
    Ok(id)
}

fn generate_entity_uuid(
    state: &AdminChannelEndpointState,
) -> Result<String, ChannelEndpointCommandBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(ChannelEndpointCommandBuildError::System)
}

fn request_id_error(error: RequestIdError) -> ChannelEndpointCommandBuildError {
    match error {
        RequestIdError::Invalid(message) => ChannelEndpointCommandBuildError::BadRequest(message),
        RequestIdError::System(message) => {
            ChannelEndpointCommandBuildError::System(DomainError::new(message))
        }
    }
}

fn command_build_error_response(error: ChannelEndpointCommandBuildError) -> Response {
    match error {
        ChannelEndpointCommandBuildError::BadRequest(message) => bad_request(message),
        ChannelEndpointCommandBuildError::System(error) => {
            channel_endpoint_system_response("channel endpoint command is invalid", error)
        }
    }
}

fn bad_request(message: String) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(PlusApiResult::error("4001", message)),
    )
        .into_response()
}

fn not_found_response(message: &'static str) -> Response {
    (
        StatusCode::NOT_FOUND,
        Json(PlusApiResult::error("4040", message)),
    )
        .into_response()
}

fn conflict_response(error: DomainError) -> Response {
    (
        StatusCode::CONFLICT,
        Json(PlusApiResult::error("4090", error.to_string())),
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

fn channel_endpoint_system_response(context: &str, error: DomainError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}
