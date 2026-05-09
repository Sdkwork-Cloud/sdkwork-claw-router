use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Bytes;
use axum::extract::{Path, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::ports::{
    AdminAppItem, AdminAppStore, AdminAppSubject, CreateAdminAppCommand, DeleteAdminAppCommand,
    GetAdminAppQuery, ListAdminAppsQuery, SetAdminAppStatusCommand, UpdateAdminAppCommand,
};

const REQUEST_ID_HEADER: &str = "X-Request-Id";
const MAX_REQUEST_ID_LEN: usize = 128;
const MAX_PAGE_SIZE: i64 = 200;
const MAX_NAME_LEN: usize = 255;
const MAX_APP_KEY_LEN: usize = 128;
const MAX_APP_TYPE_LEN: usize = 64;
const MAX_VERSION_LEN: usize = 64;
const MAX_URL_LEN: usize = 512;
const MAX_PACKAGE_LEN: usize = 255;
const MAX_DESCRIPTION_LEN: usize = 4000;
const MAX_JSON_BYTES: usize = 128 * 1024;

#[derive(Clone)]
struct AdminAppState {
    store: Arc<dyn AdminAppStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
}

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ListAppsRequest {
    keyword: Option<String>,
    status: Option<String>,
    market_status: Option<String>,
    app_type: Option<String>,
    page_no: Option<i64>,
    page_size: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateAppRequest {
    user_id: Option<Value>,
    name: Option<String>,
    description: Option<String>,
    version: Option<String>,
    icon: Option<Value>,
    icon_url: Option<String>,
    resource_list: Option<Value>,
    project_id: Option<Value>,
    access_url: Option<String>,
    config: Option<Value>,
    status: Option<String>,
    market_status: Option<String>,
    app_type: Option<String>,
    platforms: Option<Value>,
    install_platforms: Option<Value>,
    install_skill: Option<Value>,
    install_config: Option<Value>,
    release_notes: Option<Value>,
    package_name: Option<String>,
    bundle_id: Option<String>,
    store_url: Option<String>,
    download_url: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateAppRequest {
    user_id: Option<Value>,
    name: Option<String>,
    description: Option<Value>,
    version: Option<Value>,
    icon: Option<Value>,
    icon_url: Option<Value>,
    resource_list: Option<Value>,
    project_id: Option<Value>,
    access_url: Option<Value>,
    config: Option<Value>,
    app_type: Option<Value>,
    platforms: Option<Value>,
    install_platforms: Option<Value>,
    install_skill: Option<Value>,
    install_config: Option<Value>,
    release_notes: Option<Value>,
    package_name: Option<Value>,
    bundle_id: Option<Value>,
    store_url: Option<Value>,
    download_url: Option<Value>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAppListResponse<T> {
    items: Vec<T>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAppItemEnvelope<T> {
    item: T,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAppDeleteResponse {
    deleted: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAppItemResponse {
    id: String,
    uuid: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    user_id: Option<String>,
    name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    version: Option<String>,
    icon: Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    icon_url: Option<String>,
    resource_list: Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    project_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    access_url: Option<String>,
    config: Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    app_key: Option<String>,
    status: String,
    market_status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    app_type: Option<String>,
    platforms: Value,
    install_platforms: Value,
    install_skill: Value,
    install_config: Value,
    release_notes: Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    package_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    bundle_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    store_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    download_url: Option<String>,
    created_at: String,
    updated_at: String,
}

enum AdminAppCommandBuildError {
    BadRequest(String),
    System(DomainError),
}

impl From<String> for AdminAppCommandBuildError {
    fn from(value: String) -> Self {
        Self::BadRequest(value)
    }
}

pub fn admin_app_router_with_store(
    store: Arc<dyn AdminAppStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    Router::new()
        .route("/backend/v3/api/app/list", post(fetch_apps))
        .route("/backend/v3/api/app", post(create_app))
        .route(
            "/backend/v3/api/app/{app_id}",
            get(fetch_app).put(update_app).delete(delete_app),
        )
        .route("/backend/v3/api/app/{app_id}/enable", post(enable_app))
        .route("/backend/v3/api/app/{app_id}/disable", post(disable_app))
        .route("/backend/v3/api/app/{app_id}/publish", post(publish_app))
        .route("/backend/v3/api/app/{app_id}/offline", post(offline_app))
        .with_state(AdminAppState {
            store,
            entity_uuid_generator,
        })
}

async fn fetch_apps(
    State(state): State<AdminAppState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_optional_json_body::<ListAppsRequest>(&body, "app list") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let query = match normalize_list_query(subject, request) {
        Ok(query) => query,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.list_apps(query).await {
        Ok(items) => Json(PlusApiResult::success(AdminAppListResponse {
            items: items.into_iter().map(to_app_response).collect(),
        }))
        .into_response(),
        Err(error) => admin_app_system_response("app read model is unavailable", error),
    }
}

async fn fetch_app(
    State(state): State<AdminAppState>,
    Path(app_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let app_id = match normalize_id(&app_id, "appId") {
        Ok(app_id) => app_id,
        Err(error) => return command_build_error_response(error),
    };

    match state
        .store
        .get_app(GetAdminAppQuery { subject, app_id })
        .await
    {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminAppItemEnvelope {
            item: to_app_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("app was not found"),
        Err(error) => admin_app_system_response("app read model is unavailable", error),
    }
}

async fn create_app(
    State(state): State<AdminAppState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<CreateAppRequest>(&body, "app") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_app_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.create_app(command).await {
        Ok(item) => Json(PlusApiResult::success(AdminAppItemEnvelope {
            item: to_app_response(item),
        }))
        .into_response(),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => admin_app_system_response("app command store is unavailable", error),
    }
}

async fn update_app(
    State(state): State<AdminAppState>,
    Path(app_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<UpdateAppRequest>(&body, "app update") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_update_app_command(state.clone(), &headers, subject, app_id, request)
    {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.update_app(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminAppItemEnvelope {
            item: to_app_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("app was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => admin_app_system_response("app update store is unavailable", error),
    }
}

async fn enable_app(
    State(state): State<AdminAppState>,
    Path(app_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    set_app_status_response(state, headers, app_id, Some("ACTIVE"), None).await
}

async fn disable_app(
    State(state): State<AdminAppState>,
    Path(app_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    set_app_status_response(state, headers, app_id, Some("INACTIVE"), None).await
}

async fn publish_app(
    State(state): State<AdminAppState>,
    Path(app_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    set_app_status_response(state, headers, app_id, None, Some("PUBLISHED")).await
}

async fn offline_app(
    State(state): State<AdminAppState>,
    Path(app_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    set_app_status_response(state, headers, app_id, None, Some("OFFLINE")).await
}

async fn set_app_status_response(
    state: AdminAppState,
    headers: HeaderMap,
    app_id: String,
    status: Option<&str>,
    market_status: Option<&str>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_set_status_command(
        state.clone(),
        &headers,
        subject,
        app_id,
        status,
        market_status,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.set_app_status(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminAppItemEnvelope {
            item: to_app_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("app was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => admin_app_system_response("app status store is unavailable", error),
    }
}

async fn delete_app(
    State(state): State<AdminAppState>,
    Path(app_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_delete_app_command(state.clone(), &headers, subject, app_id) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.delete_app(command).await {
        Ok(deleted) => {
            Json(PlusApiResult::success(AdminAppDeleteResponse { deleted })).into_response()
        }
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => admin_app_system_response("app delete store is unavailable", error),
    }
}

fn resolve_subject(headers: &HeaderMap) -> Result<AdminAppSubject, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| AdminAppSubject {
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
    if body.len() > MAX_JSON_BYTES {
        return Err(format!("{entity_name} request body is too large"));
    }
    if body.iter().all(u8::is_ascii_whitespace) {
        return Err(format!("{entity_name} request body is required"));
    }
    serde_json::from_slice(body)
        .map_err(|error| format!("invalid {entity_name} request body: {error}"))
}

fn parse_optional_json_body<T>(body: &[u8], entity_name: &str) -> Result<T, String>
where
    T: Default + for<'de> Deserialize<'de>,
{
    if body.len() > MAX_JSON_BYTES {
        return Err(format!("{entity_name} request body is too large"));
    }
    if body.iter().all(u8::is_ascii_whitespace) {
        return Ok(T::default());
    }
    serde_json::from_slice(body)
        .map_err(|error| format!("invalid {entity_name} request body: {error}"))
}

fn normalize_list_query(
    subject: AdminAppSubject,
    request: ListAppsRequest,
) -> Result<ListAdminAppsQuery, AdminAppCommandBuildError> {
    Ok(ListAdminAppsQuery {
        subject,
        keyword: normalize_optional_text(request.keyword.as_deref(), "keyword", 128)?,
        status: request
            .status
            .as_deref()
            .map(normalize_status)
            .transpose()
            .map_err(AdminAppCommandBuildError::BadRequest)?,
        market_status: request
            .market_status
            .as_deref()
            .map(normalize_market_status)
            .transpose()
            .map_err(AdminAppCommandBuildError::BadRequest)?,
        app_type: normalize_optional_code(
            request.app_type.as_deref(),
            "appType",
            MAX_APP_TYPE_LEN,
        )?,
        page_no: normalize_optional_positive(request.page_no, "pageNo")
            .map_err(AdminAppCommandBuildError::BadRequest)?,
        page_size: normalize_optional_page_size(request.page_size)
            .map_err(AdminAppCommandBuildError::BadRequest)?,
    })
}

fn build_create_app_command(
    state: AdminAppState,
    headers: &HeaderMap,
    subject: AdminAppSubject,
    request: CreateAppRequest,
) -> Result<CreateAdminAppCommand, AdminAppCommandBuildError> {
    let app_uuid = generate_entity_uuid(&state)?;
    let mut config = request
        .config
        .map(normalize_config_object)
        .transpose()?
        .unwrap_or_else(|| Value::Object(Default::default()));
    let app_key = required_app_key_from_config(&config)?;
    ensure_app_key_in_config(&mut config, &app_key)?;

    Ok(CreateAdminAppCommand {
        subject,
        app_uuid,
        audit_log_uuid: generate_entity_uuid(&state)?,
        user_id: request
            .user_id
            .as_ref()
            .map(|value| normalize_value_id(value, "userId"))
            .transpose()?
            .or(Some(subject.operator_id)),
        name: normalize_required_text(request.name.as_deref(), "name", MAX_NAME_LEN)?,
        description: normalize_optional_text(
            request.description.as_deref(),
            "description",
            MAX_DESCRIPTION_LEN,
        )?,
        version: normalize_optional_text(request.version.as_deref(), "version", MAX_VERSION_LEN)?,
        icon: request
            .icon
            .unwrap_or_else(|| Value::Object(Default::default())),
        icon_url: normalize_optional_url(request.icon_url.as_deref(), "iconUrl")?,
        resource_list: request
            .resource_list
            .unwrap_or_else(|| Value::Object(Default::default())),
        project_id: request
            .project_id
            .as_ref()
            .map(|value| normalize_value_id(value, "projectId"))
            .transpose()?,
        access_url: normalize_optional_url(request.access_url.as_deref(), "accessUrl")?,
        config,
        app_key: Some(app_key),
        status: request
            .status
            .as_deref()
            .map(normalize_status)
            .transpose()?
            .unwrap_or_else(|| "ACTIVE".to_owned()),
        market_status: request
            .market_status
            .as_deref()
            .map(normalize_market_status)
            .transpose()?
            .unwrap_or_else(|| "DRAFT".to_owned()),
        app_type: normalize_optional_code(
            request.app_type.as_deref(),
            "appType",
            MAX_APP_TYPE_LEN,
        )?,
        platforms: request
            .platforms
            .unwrap_or_else(|| serde_json::json!({ "platforms": ["web"] })),
        install_platforms: request
            .install_platforms
            .unwrap_or_else(|| serde_json::json!({ "platforms": ["web"] })),
        install_skill: request
            .install_skill
            .unwrap_or_else(|| Value::Object(Default::default())),
        install_config: request
            .install_config
            .unwrap_or_else(|| serde_json::json!({ "packages": [] })),
        release_notes: request
            .release_notes
            .unwrap_or_else(|| Value::Array(Vec::new())),
        package_name: normalize_optional_text(
            request.package_name.as_deref(),
            "packageName",
            MAX_PACKAGE_LEN,
        )?,
        bundle_id: normalize_optional_text(
            request.bundle_id.as_deref(),
            "bundleId",
            MAX_PACKAGE_LEN,
        )?,
        store_url: normalize_optional_url(request.store_url.as_deref(), "storeUrl")?,
        download_url: normalize_optional_url(request.download_url.as_deref(), "downloadUrl")?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_app_command(
    state: AdminAppState,
    headers: &HeaderMap,
    subject: AdminAppSubject,
    app_id: String,
    request: UpdateAppRequest,
) -> Result<UpdateAdminAppCommand, AdminAppCommandBuildError> {
    let config = request.config.map(normalize_config_object).transpose()?;
    let app_key = config
        .as_ref()
        .map(required_app_key_from_config)
        .transpose()?;
    let mut config = config;
    if let Some(config) = config.as_mut() {
        ensure_app_key_in_config(config, app_key.as_deref().unwrap_or_default())?;
    }

    Ok(UpdateAdminAppCommand {
        subject,
        app_id: normalize_id(&app_id, "appId")?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        user_id: request
            .user_id
            .as_ref()
            .map(|value| normalize_nullable_value_id(value, "userId"))
            .transpose()?,
        name: request
            .name
            .as_deref()
            .map(|value| normalize_required_text(Some(value), "name", MAX_NAME_LEN))
            .transpose()?,
        description: request
            .description
            .as_ref()
            .map(|value| normalize_nullable_text_value(value, "description", MAX_DESCRIPTION_LEN))
            .transpose()?,
        version: request
            .version
            .as_ref()
            .map(|value| normalize_nullable_text_value(value, "version", MAX_VERSION_LEN))
            .transpose()?,
        icon: request.icon,
        icon_url: request
            .icon_url
            .as_ref()
            .map(|value| normalize_nullable_url_value(value, "iconUrl"))
            .transpose()?,
        resource_list: request.resource_list,
        project_id: request
            .project_id
            .as_ref()
            .map(|value| normalize_nullable_value_id(value, "projectId"))
            .transpose()?,
        access_url: request
            .access_url
            .as_ref()
            .map(|value| normalize_nullable_url_value(value, "accessUrl"))
            .transpose()?,
        config,
        app_key: app_key.map(Some),
        app_type: request
            .app_type
            .as_ref()
            .map(|value| normalize_nullable_code_value(value, "appType", MAX_APP_TYPE_LEN))
            .transpose()?,
        platforms: request.platforms,
        install_platforms: request.install_platforms,
        install_skill: request.install_skill,
        install_config: request.install_config,
        release_notes: request.release_notes,
        package_name: request
            .package_name
            .as_ref()
            .map(|value| normalize_nullable_text_value(value, "packageName", MAX_PACKAGE_LEN))
            .transpose()?,
        bundle_id: request
            .bundle_id
            .as_ref()
            .map(|value| normalize_nullable_text_value(value, "bundleId", MAX_PACKAGE_LEN))
            .transpose()?,
        store_url: request
            .store_url
            .as_ref()
            .map(|value| normalize_nullable_url_value(value, "storeUrl"))
            .transpose()?,
        download_url: request
            .download_url
            .as_ref()
            .map(|value| normalize_nullable_url_value(value, "downloadUrl"))
            .transpose()?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_set_status_command(
    state: AdminAppState,
    headers: &HeaderMap,
    subject: AdminAppSubject,
    app_id: String,
    status: Option<&str>,
    market_status: Option<&str>,
) -> Result<SetAdminAppStatusCommand, AdminAppCommandBuildError> {
    Ok(SetAdminAppStatusCommand {
        subject,
        app_id: normalize_id(&app_id, "appId")?,
        status: status.map(str::to_owned),
        market_status: market_status.map(str::to_owned),
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_delete_app_command(
    state: AdminAppState,
    headers: &HeaderMap,
    subject: AdminAppSubject,
    app_id: String,
) -> Result<DeleteAdminAppCommand, AdminAppCommandBuildError> {
    Ok(DeleteAdminAppCommand {
        subject,
        app_id: normalize_id(&app_id, "appId")?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn to_app_response(item: AdminAppItem) -> AdminAppItemResponse {
    AdminAppItemResponse {
        id: item.id.to_string(),
        uuid: item.uuid,
        user_id: item.user_id.map(|value| value.to_string()),
        name: item.name,
        description: item.description,
        version: item.version,
        icon: item.icon,
        icon_url: item.icon_url,
        resource_list: item.resource_list,
        project_id: item.project_id.map(|value| value.to_string()),
        access_url: item.access_url,
        config: item.config,
        app_key: item.app_key,
        status: item.status,
        market_status: item.market_status,
        app_type: item.app_type,
        platforms: item.platforms,
        install_platforms: item.install_platforms,
        install_skill: item.install_skill,
        install_config: item.install_config,
        release_notes: item.release_notes,
        package_name: item.package_name,
        bundle_id: item.bundle_id,
        store_url: item.store_url,
        download_url: item.download_url,
        created_at: item.created_at,
        updated_at: item.updated_at,
    }
}

fn normalize_id(value: &str, field: &str) -> Result<i64, AdminAppCommandBuildError> {
    value
        .trim()
        .parse::<i64>()
        .ok()
        .filter(|value| *value > 0)
        .ok_or_else(|| {
            AdminAppCommandBuildError::BadRequest(format!("{field} must be a positive integer"))
        })
}

fn normalize_value_id(value: &Value, field: &str) -> Result<i64, AdminAppCommandBuildError> {
    match value {
        Value::Number(number) => number.as_i64().filter(|value| *value > 0).ok_or_else(|| {
            AdminAppCommandBuildError::BadRequest(format!("{field} must be a positive integer"))
        }),
        Value::String(value) => normalize_id(value, field),
        _ => Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must be a positive integer"
        ))),
    }
}

fn normalize_nullable_value_id(
    value: &Value,
    field: &str,
) -> Result<Option<i64>, AdminAppCommandBuildError> {
    if value.is_null() {
        return Ok(None);
    }
    normalize_value_id(value, field).map(Some)
}

fn normalize_required_text(
    value: Option<&str>,
    field: &str,
    max_len: usize,
) -> Result<String, AdminAppCommandBuildError> {
    let value = value.unwrap_or_default().trim();
    if value.is_empty() {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} is required"
        )));
    }
    if value.chars().count() > max_len {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must be at most {max_len} characters"
        )));
    }
    Ok(value.to_owned())
}

fn normalize_optional_text(
    value: Option<&str>,
    field: &str,
    max_len: usize,
) -> Result<Option<String>, String> {
    let Some(value) = value else {
        return Ok(None);
    };
    let value = value.trim();
    if value.is_empty() {
        return Ok(None);
    }
    if value.chars().count() > max_len {
        return Err(format!("{field} must be at most {max_len} characters"));
    }
    Ok(Some(value.to_owned()))
}

fn normalize_nullable_text_value(
    value: &Value,
    field: &str,
    max_len: usize,
) -> Result<Option<String>, AdminAppCommandBuildError> {
    if value.is_null() {
        return Ok(None);
    }
    let Some(value) = value.as_str() else {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must be a string or null"
        )));
    };
    normalize_optional_text(Some(value), field, max_len)
        .map_err(AdminAppCommandBuildError::BadRequest)
}

fn normalize_optional_url(
    value: Option<&str>,
    field: &str,
) -> Result<Option<String>, AdminAppCommandBuildError> {
    normalize_optional_text(value, field, MAX_URL_LEN)
        .map_err(AdminAppCommandBuildError::BadRequest)
}

fn normalize_nullable_url_value(
    value: &Value,
    field: &str,
) -> Result<Option<String>, AdminAppCommandBuildError> {
    normalize_nullable_text_value(value, field, MAX_URL_LEN)
}

fn normalize_optional_code(
    value: Option<&str>,
    field: &str,
    max_len: usize,
) -> Result<Option<String>, AdminAppCommandBuildError> {
    value
        .map(|value| normalize_code(value, field, max_len))
        .transpose()
}

fn normalize_nullable_code_value(
    value: &Value,
    field: &str,
    max_len: usize,
) -> Result<Option<String>, AdminAppCommandBuildError> {
    if value.is_null() {
        return Ok(None);
    }
    let Some(value) = value.as_str() else {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must be a string or null"
        )));
    };
    normalize_code(value, field, max_len).map(Some)
}

fn normalize_code(
    value: &str,
    field: &str,
    max_len: usize,
) -> Result<String, AdminAppCommandBuildError> {
    let value = normalize_required_text(Some(value), field, max_len)?;
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b'.' | b':'))
    {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must contain only letters, numbers, hyphen, underscore, dot, or colon"
        )));
    }
    Ok(value)
}

fn normalize_app_key(value: &str) -> Result<String, AdminAppCommandBuildError> {
    let value = normalize_required_text(Some(value), "appKey", MAX_APP_KEY_LEN)?;
    let is_standard = value
        .bytes()
        .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'-')
        && value
            .bytes()
            .next()
            .is_some_and(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit())
        && value
            .bytes()
            .last()
            .is_some_and(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit());
    if !is_standard {
        return Err(AdminAppCommandBuildError::BadRequest(
            "appKey must use lowercase kebab-case".to_owned(),
        ));
    }
    Ok(value)
}

fn normalize_status(value: &str) -> Result<String, String> {
    match value.trim() {
        "ACTIVE" => Ok("ACTIVE".to_owned()),
        "INACTIVE" => Ok("INACTIVE".to_owned()),
        _ => Err("status must be ACTIVE or INACTIVE".to_owned()),
    }
}

fn normalize_market_status(value: &str) -> Result<String, String> {
    match value.trim() {
        "DRAFT" => Ok("DRAFT".to_owned()),
        "PUBLISHED" => Ok("PUBLISHED".to_owned()),
        "OFFLINE" => Ok("OFFLINE".to_owned()),
        _ => Err("marketStatus must be DRAFT, PUBLISHED, or OFFLINE".to_owned()),
    }
}

fn normalize_optional_positive(value: Option<i64>, field: &str) -> Result<Option<i64>, String> {
    match value {
        Some(value) if value <= 0 => Err(format!("{field} must be a positive integer")),
        value => Ok(value),
    }
}

fn normalize_optional_page_size(value: Option<i64>) -> Result<Option<i64>, String> {
    let value = normalize_optional_positive(value, "pageSize")?;
    if value.unwrap_or(1) > MAX_PAGE_SIZE {
        return Err(format!("pageSize must be at most {MAX_PAGE_SIZE}"));
    }
    Ok(value)
}

fn normalize_config_object(value: Value) -> Result<Value, AdminAppCommandBuildError> {
    if !value.is_object() {
        return Err(AdminAppCommandBuildError::BadRequest(
            "config must be a JSON object".to_owned(),
        ));
    }
    validate_config_section(&value, "standard")?;
    validate_config_section(&value, "portal")?;
    Ok(value)
}

fn validate_config_section(value: &Value, section: &str) -> Result<(), AdminAppCommandBuildError> {
    if value
        .get(section)
        .is_some_and(|section_value| !section_value.is_object())
    {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "config.{section} must be a JSON object"
        )));
    }
    Ok(())
}

fn app_key_from_config(config: &Value) -> Option<String> {
    config
        .get("standard")
        .and_then(|standard| standard.get("appKey"))
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
}

fn required_app_key_from_config(config: &Value) -> Result<String, AdminAppCommandBuildError> {
    let Some(app_key) = app_key_from_config(config) else {
        return Err(AdminAppCommandBuildError::BadRequest(
            "config.standard.appKey is required".to_owned(),
        ));
    };
    normalize_app_key(&app_key)
}

fn ensure_app_key_in_config(
    config: &mut Value,
    app_key: &str,
) -> Result<(), AdminAppCommandBuildError> {
    let Value::Object(root) = config else {
        return Err(AdminAppCommandBuildError::BadRequest(
            "config must be a JSON object".to_owned(),
        ));
    };
    let standard = root
        .entry("standard")
        .or_insert_with(|| Value::Object(Default::default()));
    let Value::Object(standard) = standard else {
        return Err(AdminAppCommandBuildError::BadRequest(
            "config.standard must be a JSON object".to_owned(),
        ));
    };
    standard.insert("appKey".to_owned(), Value::String(app_key.to_owned()));
    Ok(())
}

fn generate_entity_uuid(state: &AdminAppState) -> Result<String, AdminAppCommandBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(AdminAppCommandBuildError::System)
}

fn normalize_request_id(
    headers: &HeaderMap,
    state: &AdminAppState,
) -> Result<String, AdminAppCommandBuildError> {
    let generated = || generate_entity_uuid(state);
    let Some(raw) = headers.get(REQUEST_ID_HEADER) else {
        return generated();
    };
    let value = raw.to_str().unwrap_or_default().trim();
    if value.is_empty() {
        return generated();
    }
    if value.chars().count() > MAX_REQUEST_ID_LEN {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{REQUEST_ID_HEADER} must be at most {MAX_REQUEST_ID_LEN} characters"
        )));
    }
    Ok(value.to_owned())
}

fn current_timestamp_string() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs())
        .unwrap_or_default();
    seconds.to_string()
}

fn command_build_error_response(error: AdminAppCommandBuildError) -> Response {
    match error {
        AdminAppCommandBuildError::BadRequest(message) => bad_request(message),
        AdminAppCommandBuildError::System(error) => {
            admin_app_system_response("admin app command is invalid", error)
        }
    }
}

fn bad_request(message: impl Into<String>) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(PlusApiResult::error("4001", message.into())),
    )
        .into_response()
}

fn not_found_response(message: impl Into<String>) -> Response {
    (
        StatusCode::NOT_FOUND,
        Json(PlusApiResult::error("4004", message.into())),
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

fn admin_app_system_response(context: &str, error: DomainError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}
