use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Bytes;
use axum::extract::{Path, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, patch};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::{Deserialize, Serialize};

use crate::api::request_id::{generate_server_request_id, RequestIdError};
use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::ports::{
    AdminAccessGroupChannelBindingInput, AdminAccessGroupChannelBindingItem, AdminAccessGroupItem,
    AdminAccessGroupStore, AdminAccessGroupSubject, CreateAdminAccessGroupCommand,
    DeleteAdminAccessGroupCommand, ListAdminAccessGroupChannelBindingsQuery,
    ListAdminAccessGroupsQuery, ReplaceAdminAccessGroupChannelBindingsCommand,
    UpdateAdminAccessGroupCommand,
};

const MAX_NAME_LEN: usize = 128;
const MAX_PLATFORM_LEN: usize = 64;
const MAX_BILLING_TYPE_LEN: usize = 64;
const MAX_CHANNEL_BINDINGS_PER_GROUP: usize = 200;
const MAX_CHANNEL_BINDING_SCOPE_ITEMS: usize = 200;
const MAX_CHANNEL_BINDING_SCOPE_ITEM_LEN: usize = 128;
const MIN_CHANNEL_BINDING_PRIORITY: i64 = 0;
const MAX_CHANNEL_BINDING_PRIORITY: i64 = 1_000_000;
const MIN_CHANNEL_BINDING_WEIGHT: i64 = 0;
const MAX_CHANNEL_BINDING_WEIGHT: i64 = 1_000_000;
const MIN_RATE_MULTIPLIER: f64 = 0.01;
const MAX_RATE_MULTIPLIER: f64 = 100.0;
const MAX_CAPACITY_TOTAL: f64 = 1_000_000_000.0;

#[derive(Clone)]
struct AdminAccessGroupState {
    store: Arc<dyn AdminAccessGroupStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminAccessGroupCreateRequest {
    name: Option<String>,
    platform: Option<String>,
    billing_type: Option<String>,
    rate_multiplier: Option<f64>,
    #[serde(rename = "type")]
    group_type: Option<String>,
    capacity: Option<GroupCapacityRequest>,
    status: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminAccessGroupUpdateRequest {
    name: Option<String>,
    platform: Option<String>,
    billing_type: Option<String>,
    rate_multiplier: Option<f64>,
    #[serde(rename = "type")]
    group_type: Option<String>,
    capacity: Option<GroupCapacityRequest>,
    status: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminAccessGroupChannelBindingReplaceRequest {
    items: Option<Vec<AdminAccessGroupChannelBindingRequestItem>>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminAccessGroupChannelBindingRequestItem {
    channel_id: Option<String>,
    priority: Option<i64>,
    weight: Option<i64>,
    status: Option<String>,
    model_scope: Option<Vec<String>>,
    capabilities: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct GroupCapacityRequest {
    total: Option<f64>,
}

#[derive(Debug, Clone, PartialEq)]
struct NormalizedCreateRequest {
    name: String,
    platform: String,
    billing_type: String,
    rate_multiplier: f64,
    group_type: String,
    capacity_total: f64,
    status: String,
}

#[derive(Debug, Clone, PartialEq)]
struct NormalizedUpdateRequest {
    name: Option<String>,
    platform: Option<String>,
    billing_type: Option<String>,
    rate_multiplier: Option<f64>,
    group_type: Option<String>,
    capacity_total: Option<f64>,
    status: Option<String>,
}

enum AccessGroupCommandBuildError {
    BadRequest(String),
    System(DomainError),
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAccessGroupListResponse {
    items: Vec<AdminAccessGroupItemResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAccessGroupItemEnvelope {
    item: AdminAccessGroupItemResponse,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAccessGroupDeleteResponse {
    deleted: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAccessGroupChannelBindingListResponse {
    items: Vec<AdminAccessGroupChannelBindingItemResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAccessGroupItemResponse {
    id: String,
    name: String,
    platform: String,
    billing_type: String,
    rate_multiplier: f64,
    #[serde(rename = "type")]
    group_type: String,
    account_count: CountPairResponse,
    capacity: AmountPairResponse,
    usage: UsagePairResponse,
    status: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAccessGroupChannelBindingItemResponse {
    id: String,
    group_id: String,
    channel_id: String,
    channel_name: String,
    provider_code: String,
    provider_name: String,
    channel_code: String,
    models: Vec<String>,
    capabilities: Vec<String>,
    model_scope: Vec<String>,
    priority: i64,
    weight: i64,
    status: String,
    health_status: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CountPairResponse {
    available: i64,
    total: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AmountPairResponse {
    used: f64,
    total: f64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct UsagePairResponse {
    today: f64,
    total: f64,
}

pub fn admin_access_group_router_with_store(
    store: Arc<dyn AdminAccessGroupStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/router/access_groups",
            get(fetch_access_groups).post(create_access_group),
        )
        .route(
            "/backend/v3/api/router/access_groups/{group_id}",
            patch(update_access_group).delete(delete_access_group),
        )
        .route(
            "/backend/v3/api/router/access_groups/{group_id}/channel_bindings",
            get(fetch_access_group_channel_bindings).put(replace_access_group_channel_bindings),
        )
        .route(
            "/backend/v3/api/iam/access_groups",
            get(fetch_access_groups).post(create_access_group),
        )
        .route(
            "/backend/v3/api/iam/access_groups/{group_id}",
            patch(update_access_group).delete(delete_access_group),
        )
        .route(
            "/backend/v3/api/iam/access_groups/{group_id}/channel_bindings",
            get(fetch_access_group_channel_bindings).put(replace_access_group_channel_bindings),
        )
        .with_state(AdminAccessGroupState {
            store,
            entity_uuid_generator,
        })
}

async fn fetch_access_group_channel_bindings(
    State(state): State<AdminAccessGroupState>,
    headers: HeaderMap,
    Path(group_id): Path<String>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let group_id = match parse_positive_id(&group_id, "access group id") {
        Ok(group_id) => group_id,
        Err(message) => return bad_request(message),
    };

    match state
        .store
        .list_channel_bindings(ListAdminAccessGroupChannelBindingsQuery { subject, group_id })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(
            AdminAccessGroupChannelBindingListResponse {
                items: items
                    .into_iter()
                    .map(to_channel_binding_item_response)
                    .collect(),
            },
        ))
        .into_response(),
        Err(error) => access_group_system_response(
            "access group channel binding read model is unavailable",
            error,
        ),
    }
}

async fn replace_access_group_channel_bindings(
    State(state): State<AdminAccessGroupState>,
    headers: HeaderMap,
    Path(group_id): Path<String>,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let group_id = match parse_positive_id(&group_id, "access group id") {
        Ok(group_id) => group_id,
        Err(message) => return bad_request(message),
    };
    let request = match parse_json_body::<AdminAccessGroupChannelBindingReplaceRequest>(
        &body,
        "access group channel binding",
    ) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let items = match normalize_channel_binding_replace_request(request) {
        Ok(items) => items,
        Err(message) => return bad_request(message),
    };
    let command = match build_replace_channel_bindings_command(
        state.clone(),
        &headers,
        subject,
        group_id,
        items,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.replace_channel_bindings(command).await {
        Ok(items) => Json(PlusApiResult::success(
            AdminAccessGroupChannelBindingListResponse {
                items: items
                    .into_iter()
                    .map(to_channel_binding_item_response)
                    .collect(),
            },
        ))
        .into_response(),
        Err(error) if error.is_not_found() => not_found_response("access group was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => access_group_system_response(
            "access group channel binding command store is unavailable",
            error,
        ),
    }
}

async fn fetch_access_groups(
    State(state): State<AdminAccessGroupState>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state
        .store
        .list_access_groups(ListAdminAccessGroupsQuery { subject })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AdminAccessGroupListResponse {
            items: items.into_iter().map(to_item_response).collect(),
        }))
        .into_response(),
        Err(error) => access_group_system_response("access group read model is unavailable", error),
    }
}

async fn create_access_group(
    State(state): State<AdminAccessGroupState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<AdminAccessGroupCreateRequest>(&body, "access group") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let request = match normalize_create_request(request) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.create_access_group(command).await {
        Ok(item) => Json(PlusApiResult::success(AdminAccessGroupItemEnvelope {
            item: to_item_response(item),
        }))
        .into_response(),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => {
            access_group_system_response("access group command store is unavailable", error)
        }
    }
}

async fn update_access_group(
    State(state): State<AdminAccessGroupState>,
    headers: HeaderMap,
    Path(group_id): Path<String>,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let group_id = match parse_positive_id(&group_id, "access group id") {
        Ok(group_id) => group_id,
        Err(message) => return bad_request(message),
    };
    let request = match parse_json_body::<AdminAccessGroupUpdateRequest>(&body, "access group") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let request = match normalize_update_request(request) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_update_command(state.clone(), &headers, subject, group_id, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.update_access_group(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminAccessGroupItemEnvelope {
            item: to_item_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("access group was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => {
            access_group_system_response("access group command store is unavailable", error)
        }
    }
}

async fn delete_access_group(
    State(state): State<AdminAccessGroupState>,
    headers: HeaderMap,
    Path(group_id): Path<String>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let group_id = match parse_positive_id(&group_id, "access group id") {
        Ok(group_id) => group_id,
        Err(message) => return bad_request(message),
    };
    let command = match build_delete_command(state.clone(), &headers, subject, group_id) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.delete_access_group(command).await {
        Ok(true) => Json(PlusApiResult::success(AdminAccessGroupDeleteResponse {
            deleted: true,
        }))
        .into_response(),
        Ok(false) => not_found_response("access group was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => {
            access_group_system_response("access group command store is unavailable", error)
        }
    }
}

fn resolve_subject(headers: &HeaderMap) -> Result<AdminAccessGroupSubject, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| AdminAccessGroupSubject {
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

fn parse_json_body<T>(body: &[u8], entity_name: &str) -> Result<T, String>
where
    T: for<'de> Deserialize<'de>,
{
    if body.iter().all(u8::is_ascii_whitespace) {
        return Err(format!("{entity_name} request body is required"));
    }
    serde_json::from_slice(body)
        .map_err(|error| format!("invalid {entity_name} request body: {error}"))
}

fn normalize_create_request(
    request: AdminAccessGroupCreateRequest,
) -> Result<NormalizedCreateRequest, String> {
    Ok(NormalizedCreateRequest {
        name: normalize_required_text(request.name.as_deref(), "access group name", MAX_NAME_LEN)?,
        platform: normalize_platform(request.platform.as_deref())?,
        billing_type: normalize_billing_type(request.billing_type.as_deref())?,
        rate_multiplier: normalize_rate_multiplier(request.rate_multiplier.unwrap_or(1.0))?,
        group_type: normalize_group_type(request.group_type.as_deref())?,
        capacity_total: normalize_capacity_total(
            request
                .capacity
                .and_then(|capacity| capacity.total)
                .unwrap_or(100.0),
        )?,
        status: normalize_status(request.status.as_deref())?,
    })
}

fn normalize_update_request(
    request: AdminAccessGroupUpdateRequest,
) -> Result<NormalizedUpdateRequest, String> {
    let name = request
        .name
        .as_deref()
        .map(|value| normalize_required_text(Some(value), "access group name", MAX_NAME_LEN))
        .transpose()?;
    let platform = request
        .platform
        .as_deref()
        .map(|value| normalize_platform(Some(value)))
        .transpose()?;
    let billing_type = request
        .billing_type
        .as_deref()
        .map(|value| normalize_billing_type(Some(value)))
        .transpose()?;
    let rate_multiplier = request
        .rate_multiplier
        .map(normalize_rate_multiplier)
        .transpose()?;
    let group_type = request
        .group_type
        .as_deref()
        .map(|value| normalize_group_type(Some(value)))
        .transpose()?;
    let capacity_total = request
        .capacity
        .and_then(|capacity| capacity.total)
        .map(normalize_capacity_total)
        .transpose()?;
    let status = request
        .status
        .as_deref()
        .map(|value| normalize_status(Some(value)))
        .transpose()?;

    if name.is_none()
        && platform.is_none()
        && billing_type.is_none()
        && rate_multiplier.is_none()
        && group_type.is_none()
        && capacity_total.is_none()
        && status.is_none()
    {
        return Err("access group update must include at least one editable field".to_owned());
    }

    Ok(NormalizedUpdateRequest {
        name,
        platform,
        billing_type,
        rate_multiplier,
        group_type,
        capacity_total,
        status,
    })
}

fn normalize_channel_binding_replace_request(
    request: AdminAccessGroupChannelBindingReplaceRequest,
) -> Result<Vec<AdminAccessGroupChannelBindingInput>, String> {
    let items = request.items.unwrap_or_default();
    if items.len() > MAX_CHANNEL_BINDINGS_PER_GROUP {
        return Err(format!(
            "access group channel bindings must include at most {MAX_CHANNEL_BINDINGS_PER_GROUP} items"
        ));
    }
    let mut seen = std::collections::BTreeSet::new();
    let mut normalized = Vec::with_capacity(items.len());
    for item in items {
        let channel_id = parse_positive_id(item.channel_id.as_deref().unwrap_or(""), "channel id")?;
        if !seen.insert(channel_id) {
            return Err(format!(
                "access group channel bindings contains duplicate channel id: {channel_id}"
            ));
        }
        normalized.push(AdminAccessGroupChannelBindingInput {
            channel_id,
            priority: normalize_integer_range(
                item.priority.unwrap_or(100),
                "access group channel binding priority",
                MIN_CHANNEL_BINDING_PRIORITY,
                MAX_CHANNEL_BINDING_PRIORITY,
            )?,
            weight: normalize_integer_range(
                item.weight.unwrap_or(100),
                "access group channel binding weight",
                MIN_CHANNEL_BINDING_WEIGHT,
                MAX_CHANNEL_BINDING_WEIGHT,
            )?,
            status: normalize_binding_status(item.status.as_deref())?,
            model_scope: normalize_scope_items(
                item.model_scope.unwrap_or_default(),
                "access group channel binding modelScope",
            )?,
            capabilities: normalize_scope_items(
                item.capabilities.unwrap_or_default(),
                "access group channel binding capabilities",
            )?,
        });
    }
    Ok(normalized)
}

fn normalize_required_text(
    value: Option<&str>,
    field_name: &str,
    max_len: usize,
) -> Result<String, String> {
    let value = value.unwrap_or("").trim();
    if value.is_empty() {
        return Err(format!("{field_name} is required"));
    }
    if value.chars().count() > max_len {
        return Err(format!("{field_name} must be at most {max_len} characters"));
    }
    Ok(value.to_owned())
}

fn normalize_platform(value: Option<&str>) -> Result<String, String> {
    let value = value.unwrap_or("openai").trim().to_ascii_lowercase();
    let platform = match value.as_str() {
        "openai" => "openai",
        "anthropic" => "anthropic",
        "gemini" | "google" | "google gemini" => "google",
        "openrouter" => "openrouter",
        "deepseek" => "deepseek",
        "zhipu" | "zhipuai" | "zhipu ai" => "zhipu",
        "mistral" | "mistral ai" => "mistral",
        "meta" | "meta llama" | "llama" => "meta",
        "ollama" => "ollama",
        "azure" | "azure openai" => "azure_openai",
        "custom" => "custom",
        _ => value.as_str(),
    };
    if platform.is_empty() || platform.len() > MAX_PLATFORM_LEN {
        return Err("access group platform is invalid".to_owned());
    }
    if !platform
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_'))
    {
        return Err("access group platform may only contain letters, numbers, -, and _".to_owned());
    }
    Ok(platform.to_owned())
}

fn normalize_billing_type(value: Option<&str>) -> Result<String, String> {
    let value = value.unwrap_or("standard").trim().to_ascii_lowercase();
    if value.chars().count() > MAX_BILLING_TYPE_LEN {
        return Err(format!(
            "access group billingType must be at most {MAX_BILLING_TYPE_LEN} characters"
        ));
    }
    if value.contains("subscription") || value.contains("quota") {
        Ok("subscription".to_owned())
    } else {
        Ok("standard".to_owned())
    }
}

fn normalize_group_type(value: Option<&str>) -> Result<String, String> {
    let value = value.unwrap_or("public").trim().to_ascii_lowercase();
    if value.is_empty() || value == "public" || value == "shared" {
        Ok("public".to_owned())
    } else if value == "dedicated" || value == "private" || value == "exclusive" {
        Ok("dedicated".to_owned())
    } else {
        Ok("public".to_owned())
    }
}

fn normalize_status(value: Option<&str>) -> Result<String, String> {
    let value = value.unwrap_or("active").trim().to_ascii_lowercase();
    match value.as_str() {
        "active" | "normal" => Ok("active".to_owned()),
        "disabled" | "inactive" | "error" | "abnormal" => Ok("disabled".to_owned()),
        _ => Err("access group status must be one of active, disabled, or error".to_owned()),
    }
}

fn normalize_rate_multiplier(value: f64) -> Result<f64, String> {
    if !value.is_finite() || !(MIN_RATE_MULTIPLIER..=MAX_RATE_MULTIPLIER).contains(&value) {
        return Err(format!(
            "access group rateMultiplier must be between {MIN_RATE_MULTIPLIER} and {MAX_RATE_MULTIPLIER}"
        ));
    }
    Ok((value * 1_000_000.0).round() / 1_000_000.0)
}

fn normalize_capacity_total(value: f64) -> Result<f64, String> {
    if !value.is_finite() || !(0.0..=MAX_CAPACITY_TOTAL).contains(&value) {
        return Err(format!(
            "access group capacity total must be between 0 and {MAX_CAPACITY_TOTAL}"
        ));
    }
    Ok(value.round())
}

fn normalize_integer_range(
    value: i64,
    field_name: &str,
    min: i64,
    max: i64,
) -> Result<i64, String> {
    if value < min || value > max {
        return Err(format!("{field_name} must be between {min} and {max}"));
    }
    Ok(value)
}

fn normalize_binding_status(value: Option<&str>) -> Result<String, String> {
    let value = value.unwrap_or("active").trim().to_ascii_lowercase();
    match value.as_str() {
        "active" | "normal" => Ok("active".to_owned()),
        "disabled" | "inactive" => Ok("disabled".to_owned()),
        _ => Err("access group channel binding status must be active or disabled".to_owned()),
    }
}

fn normalize_scope_items(values: Vec<String>, field_name: &str) -> Result<Vec<String>, String> {
    if values.len() > MAX_CHANNEL_BINDING_SCOPE_ITEMS {
        return Err(format!(
            "{field_name} must include at most {MAX_CHANNEL_BINDING_SCOPE_ITEMS} items"
        ));
    }
    let mut seen = std::collections::BTreeSet::new();
    let mut normalized = Vec::new();
    for value in values {
        let value = value.trim();
        if value.is_empty() {
            continue;
        }
        if value.chars().count() > MAX_CHANNEL_BINDING_SCOPE_ITEM_LEN {
            return Err(format!(
                "{field_name} items must be at most {MAX_CHANNEL_BINDING_SCOPE_ITEM_LEN} characters"
            ));
        }
        if seen.insert(value.to_owned()) {
            normalized.push(value.to_owned());
        }
    }
    Ok(normalized)
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

fn build_create_command(
    state: AdminAccessGroupState,
    _headers: &HeaderMap,
    subject: AdminAccessGroupSubject,
    request: NormalizedCreateRequest,
) -> Result<CreateAdminAccessGroupCommand, AccessGroupCommandBuildError> {
    let group_uuid = generate_entity_uuid(&state)?;
    Ok(CreateAdminAccessGroupCommand {
        subject,
        code: entity_code("grp", &group_uuid),
        group_uuid,
        audit_log_uuid: generate_entity_uuid(&state)?,
        config_snapshot_uuid: generate_entity_uuid(&state)?,
        binding_uuid: generate_entity_uuid(&state)?,
        name: request.name,
        platform: request.platform,
        billing_type: request.billing_type,
        rate_multiplier: request.rate_multiplier,
        group_type: request.group_type,
        capacity_total: request.capacity_total,
        status: request.status,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_command(
    state: AdminAccessGroupState,
    _headers: &HeaderMap,
    subject: AdminAccessGroupSubject,
    group_id: i64,
    request: NormalizedUpdateRequest,
) -> Result<UpdateAdminAccessGroupCommand, AccessGroupCommandBuildError> {
    Ok(UpdateAdminAccessGroupCommand {
        subject,
        group_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        config_snapshot_uuid: generate_entity_uuid(&state)?,
        binding_uuid: generate_entity_uuid(&state)?,
        name: request.name,
        platform: request.platform,
        billing_type: request.billing_type,
        rate_multiplier: request.rate_multiplier,
        group_type: request.group_type,
        capacity_total: request.capacity_total,
        status: request.status,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_delete_command(
    state: AdminAccessGroupState,
    _headers: &HeaderMap,
    subject: AdminAccessGroupSubject,
    group_id: i64,
) -> Result<DeleteAdminAccessGroupCommand, AccessGroupCommandBuildError> {
    Ok(DeleteAdminAccessGroupCommand {
        subject,
        group_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        config_snapshot_uuid: generate_entity_uuid(&state)?,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_replace_channel_bindings_command(
    state: AdminAccessGroupState,
    _headers: &HeaderMap,
    subject: AdminAccessGroupSubject,
    group_id: i64,
    items: Vec<AdminAccessGroupChannelBindingInput>,
) -> Result<ReplaceAdminAccessGroupChannelBindingsCommand, AccessGroupCommandBuildError> {
    let mut binding_uuids = Vec::with_capacity(items.len());
    for _ in &items {
        binding_uuids.push(generate_entity_uuid(&state)?);
    }
    Ok(ReplaceAdminAccessGroupChannelBindingsCommand {
        subject,
        group_id,
        binding_uuids,
        audit_log_uuid: generate_entity_uuid(&state)?,
        config_snapshot_uuid: generate_entity_uuid(&state)?,
        items,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn generate_entity_uuid(
    state: &AdminAccessGroupState,
) -> Result<String, AccessGroupCommandBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(AccessGroupCommandBuildError::System)
}

fn request_id_error(error: RequestIdError) -> AccessGroupCommandBuildError {
    match error {
        RequestIdError::Invalid(message) => AccessGroupCommandBuildError::BadRequest(message),
        RequestIdError::System(message) => {
            AccessGroupCommandBuildError::System(DomainError::new(message))
        }
    }
}

fn to_item_response(item: AdminAccessGroupItem) -> AdminAccessGroupItemResponse {
    AdminAccessGroupItemResponse {
        id: item.id.to_string(),
        name: item.name,
        platform: item.platform,
        billing_type: item.billing_type,
        rate_multiplier: item.rate_multiplier,
        group_type: item.group_type,
        account_count: CountPairResponse {
            available: item.account_available,
            total: item.account_total,
        },
        capacity: AmountPairResponse {
            used: item.capacity_used,
            total: item.capacity_total,
        },
        usage: UsagePairResponse {
            today: item.usage_today,
            total: item.usage_total,
        },
        status: item.status,
    }
}

fn to_channel_binding_item_response(
    item: AdminAccessGroupChannelBindingItem,
) -> AdminAccessGroupChannelBindingItemResponse {
    AdminAccessGroupChannelBindingItemResponse {
        id: item.id.to_string(),
        group_id: item.group_id.to_string(),
        channel_id: item.channel_id.to_string(),
        channel_name: item.channel_name,
        provider_code: item.provider_code,
        provider_name: item.provider_name,
        channel_code: item.channel_code,
        models: item.models,
        capabilities: item.capabilities,
        model_scope: item.model_scope,
        priority: item.priority,
        weight: item.weight,
        status: item.status,
        health_status: item.health_status,
    }
}

fn entity_code(prefix: &str, uuid: &str) -> String {
    let short = uuid.chars().take(24).collect::<String>();
    format!("{prefix}-{short}")
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

fn command_build_error_response(error: AccessGroupCommandBuildError) -> Response {
    match error {
        AccessGroupCommandBuildError::BadRequest(message) => bad_request(message),
        AccessGroupCommandBuildError::System(error) => {
            access_group_system_response("access group command is invalid", error)
        }
    }
}

fn access_group_system_response(context: &str, error: DomainError) -> Response {
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
