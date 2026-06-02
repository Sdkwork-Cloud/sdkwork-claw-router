use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Bytes;
use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::api::request_id::{generate_server_request_id, RequestIdError};
use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::ports::{
    AdminAppCategoryItem, AdminAppItem, AdminAppPage, AdminAppStore, AdminAppSubject,
    AdminAppTemplateItem, AdminAppTemplatePage, CreateAdminAppCategoryCommand,
    CreateAdminAppCommand, CreateAdminAppTemplateCommand, DeleteAdminAppCategoryCommand,
    DeleteAdminAppCommand, DeleteAdminAppTemplateCommand, GetAdminAppQuery,
    GetAdminAppTemplateQuery, ListAdminAppCategoriesQuery, ListAdminAppTemplatesQuery,
    ListAdminAppsQuery, SetAdminAppStatusCommand, SetAdminAppTemplatePublishStatusCommand,
    UpdateAdminAppCategoryCommand, UpdateAdminAppCommand, UpdateAdminAppTemplateCommand,
};

const MAX_PAGE_SIZE: i64 = 200;
const MAX_NAME_LEN: usize = 255;
const MAX_APP_KEY_LEN: usize = 128;
const MAX_APP_TYPE_LEN: usize = 64;
const MAX_VERSION_LEN: usize = 64;
const MAX_URL_LEN: usize = 512;
const MAX_PACKAGE_LEN: usize = 255;
const MAX_DESCRIPTION_LEN: usize = 4000;
const MAX_CATEGORY_NAME_LEN: usize = 255;
const MAX_CATEGORY_CODE_LEN: usize = 128;
const MAX_CATEGORY_PATH_LEN: usize = 1024;
const MAX_MEDIA_LABEL_LEN: usize = 64;
const MAX_MEDIA_LOCATOR_LEN: usize = 1024;
const MAX_TEMPLATE_NO_LEN: usize = 64;
const MAX_TEMPLATE_CODE_LEN: usize = 128;
const MAX_TEMPLATE_NAME_LEN: usize = 255;
const MAX_TEMPLATE_KIND_LEN: usize = 128;
const MAX_TEMPLATE_GIT_REPO_URL_LEN: usize = 1024;
const MAX_TEMPLATE_GIT_REF_LEN: usize = 128;
const MAX_TEMPLATE_GIT_SUB_PATH_LEN: usize = 1024;
const APP_STORE_CATEGORY_TYPE: i32 = 999_999;
const DEFAULT_JSON_BODY_MAX_BYTES: usize =
    sdkwork_claw_config::RequestLimitsConfig::DEFAULT_ADMIN_APP_JSON_BODY_MAX_BYTES;

#[derive(Clone)]
struct AdminAppState {
    store: Arc<dyn AdminAppStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    json_body_max_bytes: usize,
}

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ListAppsRequest {
    keyword: Option<String>,
    status: Option<String>,
    market_status: Option<String>,
    app_type: Option<String>,
    category_id: Option<i64>,
    page_no: Option<i64>,
    page_size: Option<i64>,
}

#[derive(Debug, Default, Deserialize)]
struct ListAppsQuery {
    q: Option<String>,
    status: Option<String>,
    market_status: Option<String>,
    app_type: Option<String>,
    category_id: Option<i64>,
    page: Option<i64>,
    page_size: Option<i64>,
}

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ListTemplatesRequest {
    keyword: Option<String>,
    publish_status: Option<String>,
    template_type: Option<String>,
    runtime: Option<String>,
    category_id: Option<i64>,
    page_no: Option<i64>,
    page_size: Option<i64>,
}

#[derive(Debug, Default, Deserialize)]
struct ListTemplatesQuery {
    q: Option<String>,
    publish_status: Option<String>,
    template_type: Option<String>,
    runtime: Option<String>,
    category_id: Option<i64>,
    page: Option<i64>,
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
    artifact: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateTemplateRequest {
    template_no: Option<String>,
    template_code: Option<String>,
    template_name: Option<String>,
    description: Option<String>,
    category_id: Option<Value>,
    category_code: Option<String>,
    template_type: Option<String>,
    runtime: Option<String>,
    framework: Option<String>,
    language: Option<String>,
    icon: Option<Value>,
    cover: Option<Value>,
    visibility: Option<String>,
    publish_status: Option<String>,
    featured: Option<bool>,
    sort_weight: Option<i32>,
    source_app_id: Option<Value>,
    git_repo_url: Option<String>,
    git_ref: Option<String>,
    git_sub_path: Option<String>,
    app_config_schema: Option<Value>,
    default_app_config: Option<Value>,
    variable_schema: Option<Value>,
    dependency_manifest: Option<Value>,
    capability_manifest: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateAppRequest {
    user_id: Option<Value>,
    name: Option<String>,
    description: Option<Value>,
    version: Option<Value>,
    icon: Option<Value>,
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
    artifact: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateTemplateRequest {
    template_name: Option<String>,
    description: Option<Value>,
    category_id: Option<Value>,
    category_code: Option<Value>,
    template_type: Option<Value>,
    runtime: Option<Value>,
    framework: Option<Value>,
    language: Option<Value>,
    icon: Option<Value>,
    cover: Option<Value>,
    visibility: Option<String>,
    publish_status: Option<String>,
    featured: Option<bool>,
    sort_weight: Option<i32>,
    source_app_id: Option<Value>,
    git_repo_url: Option<Value>,
    git_ref: Option<Value>,
    git_sub_path: Option<Value>,
    app_config_schema: Option<Value>,
    default_app_config: Option<Value>,
    variable_schema: Option<Value>,
    dependency_manifest: Option<Value>,
    capability_manifest: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateCategoryRequest {
    name: Option<String>,
    description: Option<String>,
    code: Option<String>,
    icon: Option<Value>,
    sort_weight: Option<i32>,
    parent_id: Option<Value>,
    path: Option<String>,
    visible: Option<bool>,
    status: Option<i32>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateCategoryRequest {
    name: Option<String>,
    description: Option<Value>,
    code: Option<Value>,
    icon: Option<Value>,
    sort_weight: Option<i32>,
    parent_id: Option<Value>,
    path: Option<Value>,
    visible: Option<bool>,
    status: Option<i32>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAppListResponse<T> {
    items: Vec<T>,
    total: i64,
    page: i64,
    page_size: i64,
    has_next_page: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAppItemsResponse<T> {
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
struct AdminAppTemplateDeleteResponse {
    deleted: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAppCategoryItemResponse {
    id: String,
    name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    icon: Option<Value>,
    sort_weight: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    parent_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    path: Option<String>,
    visible: bool,
    status: i32,
    #[serde(rename = "type")]
    category_type: i32,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAppCategoryDeleteResponse {
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
    artifact: Option<Value>,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAppTemplateItemResponse {
    id: String,
    uuid: String,
    template_no: String,
    template_code: String,
    template_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    category_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    category_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    template_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    runtime: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    framework: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    icon: Option<Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    cover: Option<Value>,
    visibility: String,
    publish_status: String,
    featured: bool,
    sort_weight: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    source_app_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    git_repo_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    git_ref: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    git_sub_path: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    current_version_id: Option<String>,
    app_config_schema: Value,
    default_app_config: Value,
    variable_schema: Value,
    dependency_manifest: Value,
    capability_manifest: Value,
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

impl From<ListAppsQuery> for ListAppsRequest {
    fn from(value: ListAppsQuery) -> Self {
        Self {
            keyword: value.q,
            status: value.status,
            market_status: value.market_status,
            app_type: value.app_type,
            category_id: value.category_id,
            page_no: value.page,
            page_size: value.page_size,
        }
    }
}

impl From<ListTemplatesQuery> for ListTemplatesRequest {
    fn from(value: ListTemplatesQuery) -> Self {
        Self {
            keyword: value.q,
            publish_status: value.publish_status,
            template_type: value.template_type,
            runtime: value.runtime,
            category_id: value.category_id,
            page_no: value.page,
            page_size: value.page_size,
        }
    }
}

pub fn admin_app_router_with_store(
    store: Arc<dyn AdminAppStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    admin_app_router_with_store_and_json_body_limit(
        store,
        entity_uuid_generator,
        DEFAULT_JSON_BODY_MAX_BYTES,
    )
}

pub fn admin_app_router_with_store_and_json_body_limit(
    store: Arc<dyn AdminAppStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    json_body_max_bytes: usize,
) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/platform/apps/categories",
            get(fetch_categories).post(create_category),
        )
        .route(
            "/backend/v3/api/platform/apps/categories/{category_id}",
            get(fetch_categories)
                .put(update_category)
                .delete(delete_category),
        )
        .route("/backend/v3/api/platform/apps/list", post(fetch_apps))
        .route(
            "/backend/v3/api/platform/apps/templates/list",
            post(fetch_templates),
        )
        .route(
            "/backend/v3/api/platform/apps/templates",
            get(fetch_templates_from_query).post(create_template),
        )
        .route(
            "/backend/v3/api/platform/apps/templates/{template_id}",
            get(fetch_template)
                .put(update_template)
                .delete(delete_template),
        )
        .route(
            "/backend/v3/api/platform/apps/templates/{template_id}/publish",
            post(publish_template),
        )
        .route(
            "/backend/v3/api/platform/apps/templates/{template_id}/offline",
            post(offline_template),
        )
        .route(
            "/backend/v3/api/platform/apps/templates/{template_id}/unpublish",
            post(offline_template),
        )
        .route(
            "/backend/v3/api/platform/apps",
            get(fetch_apps_from_query).post(create_app),
        )
        .route(
            "/backend/v3/api/platform/apps/{app_id}",
            get(fetch_app).put(update_app).delete(delete_app),
        )
        .route(
            "/backend/v3/api/platform/apps/{app_id}/enable",
            post(enable_app),
        )
        .route(
            "/backend/v3/api/platform/apps/{app_id}/disable",
            post(disable_app),
        )
        .route(
            "/backend/v3/api/platform/apps/{app_id}/publish",
            post(publish_app),
        )
        .route(
            "/backend/v3/api/platform/apps/{app_id}/offline",
            post(offline_app),
        )
        .route(
            "/backend/v3/api/platform/apps/{app_id}/unpublish",
            post(offline_app),
        )
        .with_state(AdminAppState {
            store,
            entity_uuid_generator,
            json_body_max_bytes: json_body_max_bytes.max(1),
        })
}

async fn fetch_categories(State(state): State<AdminAppState>, headers: HeaderMap) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .store
        .list_categories(ListAdminAppCategoriesQuery { subject })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AdminAppItemsResponse {
            items: items.into_iter().map(to_category_response).collect(),
        }))
        .into_response(),
        Err(error) => admin_app_system_response("app category read model is unavailable", error),
    }
}

async fn create_category(
    State(state): State<AdminAppState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<CreateCategoryRequest>(
        &body,
        "app category",
        state.json_body_max_bytes,
    ) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_category_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.create_category(command).await {
        Ok(item) => Json(PlusApiResult::success(AdminAppItemEnvelope {
            item: to_category_response(item),
        }))
        .into_response(),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => admin_app_system_response("app category command store is unavailable", error),
    }
}

async fn update_category(
    State(state): State<AdminAppState>,
    Path(category_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<UpdateCategoryRequest>(
        &body,
        "app category update",
        state.json_body_max_bytes,
    ) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command =
        match build_update_category_command(state.clone(), &headers, subject, category_id, request)
        {
            Ok(command) => command,
            Err(error) => return command_build_error_response(error),
        };
    match state.store.update_category(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminAppItemEnvelope {
            item: to_category_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("app category was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => admin_app_system_response("app category update store is unavailable", error),
    }
}

async fn delete_category(
    State(state): State<AdminAppState>,
    Path(category_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_delete_category_command(state.clone(), &headers, subject, category_id)
    {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.delete_category(command).await {
        Ok(deleted) => Json(PlusApiResult::success(AdminAppCategoryDeleteResponse {
            deleted,
        }))
        .into_response(),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => admin_app_system_response("app category delete store is unavailable", error),
    }
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
    let request = match parse_optional_json_body::<ListAppsRequest>(
        &body,
        "app list",
        state.json_body_max_bytes,
    ) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let query = match normalize_list_query(subject, request) {
        Ok(query) => query,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.list_apps(query).await {
        Ok(page) => Json(PlusApiResult::success(to_app_list_response(page))).into_response(),
        Err(error) => admin_app_system_response("app read model is unavailable", error),
    }
}

async fn fetch_apps_from_query(
    State(state): State<AdminAppState>,
    headers: HeaderMap,
    Query(query): Query<ListAppsQuery>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match normalize_list_query(subject, query.into()) {
        Ok(query) => query,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.list_apps(query).await {
        Ok(page) => Json(PlusApiResult::success(to_app_list_response(page))).into_response(),
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

async fn fetch_templates(
    State(state): State<AdminAppState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_optional_json_body::<ListTemplatesRequest>(
        &body,
        "app template list",
        state.json_body_max_bytes,
    ) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let query = match normalize_template_list_query(subject, request) {
        Ok(query) => query,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.list_app_templates(query).await {
        Ok(page) => Json(PlusApiResult::success(to_template_list_response(page))).into_response(),
        Err(error) => admin_app_system_response("app template read model is unavailable", error),
    }
}

async fn fetch_templates_from_query(
    State(state): State<AdminAppState>,
    headers: HeaderMap,
    Query(query): Query<ListTemplatesQuery>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match normalize_template_list_query(subject, query.into()) {
        Ok(query) => query,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.list_app_templates(query).await {
        Ok(page) => Json(PlusApiResult::success(to_template_list_response(page))).into_response(),
        Err(error) => admin_app_system_response("app template read model is unavailable", error),
    }
}

async fn fetch_template(
    State(state): State<AdminAppState>,
    Path(template_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let template_id = match normalize_id(&template_id, "templateId") {
        Ok(template_id) => template_id,
        Err(error) => return command_build_error_response(error),
    };

    match state
        .store
        .get_app_template(GetAdminAppTemplateQuery {
            subject,
            template_id,
        })
        .await
    {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminAppItemEnvelope {
            item: to_template_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("app template was not found"),
        Err(error) => admin_app_system_response("app template read model is unavailable", error),
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
    let request = match parse_json_body::<CreateAppRequest>(&body, "app", state.json_body_max_bytes)
    {
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

async fn create_template(
    State(state): State<AdminAppState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<CreateTemplateRequest>(
        &body,
        "app template",
        state.json_body_max_bytes,
    ) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_template_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.create_app_template(command).await {
        Ok(item) => Json(PlusApiResult::success(AdminAppItemEnvelope {
            item: to_template_response(item),
        }))
        .into_response(),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => admin_app_system_response("app template command store is unavailable", error),
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
    let request =
        match parse_json_body::<UpdateAppRequest>(&body, "app update", state.json_body_max_bytes) {
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

async fn update_template(
    State(state): State<AdminAppState>,
    Path(template_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<UpdateTemplateRequest>(
        &body,
        "app template update",
        state.json_body_max_bytes,
    ) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command =
        match build_update_template_command(state.clone(), &headers, subject, template_id, request)
        {
            Ok(command) => command,
            Err(error) => return command_build_error_response(error),
        };
    match state.store.update_app_template(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminAppItemEnvelope {
            item: to_template_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("app template was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => admin_app_system_response("app template update store is unavailable", error),
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

async fn publish_template(
    State(state): State<AdminAppState>,
    Path(template_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    set_template_publish_status_response(state, headers, template_id, "PUBLISHED").await
}

async fn offline_template(
    State(state): State<AdminAppState>,
    Path(template_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    set_template_publish_status_response(state, headers, template_id, "OFFLINE").await
}

async fn set_template_publish_status_response(
    state: AdminAppState,
    headers: HeaderMap,
    template_id: String,
    publish_status: &str,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_set_template_publish_status_command(
        state.clone(),
        &headers,
        subject,
        template_id,
        publish_status,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.set_app_template_publish_status(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminAppItemEnvelope {
            item: to_template_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("app template was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => admin_app_system_response("app template status store is unavailable", error),
    }
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

async fn delete_template(
    State(state): State<AdminAppState>,
    Path(template_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_delete_template_command(state.clone(), &headers, subject, template_id)
    {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.delete_app_template(command).await {
        Ok(deleted) => Json(PlusApiResult::success(AdminAppTemplateDeleteResponse {
            deleted,
        }))
        .into_response(),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => admin_app_system_response("app template delete store is unavailable", error),
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

fn parse_json_body<T>(body: &[u8], entity_name: &str, max_bytes: usize) -> Result<T, String>
where
    T: for<'de> Deserialize<'de>,
{
    if body.len() > max_bytes {
        return Err(format!("{entity_name} request body is too large"));
    }
    if body.iter().all(u8::is_ascii_whitespace) {
        return Err(format!("{entity_name} request body is required"));
    }
    serde_json::from_slice(body)
        .map_err(|error| format!("invalid {entity_name} request body: {error}"))
}

fn parse_optional_json_body<T>(
    body: &[u8],
    entity_name: &str,
    max_bytes: usize,
) -> Result<T, String>
where
    T: Default + for<'de> Deserialize<'de>,
{
    if body.len() > max_bytes {
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
        category_id: normalize_optional_positive(request.category_id, "categoryId")
            .map_err(AdminAppCommandBuildError::BadRequest)?,
        page_no: normalize_optional_positive(request.page_no, "pageNo")
            .map_err(AdminAppCommandBuildError::BadRequest)?,
        page_size: normalize_optional_page_size(request.page_size)
            .map_err(AdminAppCommandBuildError::BadRequest)?,
    })
}

fn normalize_template_list_query(
    subject: AdminAppSubject,
    request: ListTemplatesRequest,
) -> Result<ListAdminAppTemplatesQuery, AdminAppCommandBuildError> {
    Ok(ListAdminAppTemplatesQuery {
        subject,
        keyword: normalize_optional_text(request.keyword.as_deref(), "keyword", 128)?,
        publish_status: request
            .publish_status
            .as_deref()
            .map(normalize_template_publish_status)
            .transpose()
            .map_err(AdminAppCommandBuildError::BadRequest)?,
        template_type: normalize_optional_code(
            request.template_type.as_deref(),
            "templateType",
            MAX_TEMPLATE_KIND_LEN,
        )?,
        runtime: normalize_optional_code(
            request.runtime.as_deref(),
            "runtime",
            MAX_TEMPLATE_KIND_LEN,
        )?,
        category_id: normalize_optional_positive(request.category_id, "categoryId")
            .map_err(AdminAppCommandBuildError::BadRequest)?,
        page_no: normalize_optional_positive(request.page_no, "pageNo")
            .map_err(AdminAppCommandBuildError::BadRequest)?,
        page_size: normalize_optional_page_size(request.page_size)
            .map_err(AdminAppCommandBuildError::BadRequest)?,
    })
}

fn to_app_list_response(page: AdminAppPage) -> AdminAppListResponse<AdminAppItemResponse> {
    AdminAppListResponse {
        items: page.items.into_iter().map(to_app_response).collect(),
        total: page.total,
        page: page.page,
        page_size: page.page_size,
        has_next_page: page.has_next_page,
    }
}

fn to_template_list_response(
    page: AdminAppTemplatePage,
) -> AdminAppListResponse<AdminAppTemplateItemResponse> {
    AdminAppListResponse {
        items: page.items.into_iter().map(to_template_response).collect(),
        total: page.total,
        page: page.page,
        page_size: page.page_size,
        has_next_page: page.has_next_page,
    }
}

fn build_create_app_command(
    state: AdminAppState,
    _headers: &HeaderMap,
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
        artifact: optional_media_resource(request.artifact, "artifact")?,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_create_template_command(
    state: AdminAppState,
    _headers: &HeaderMap,
    subject: AdminAppSubject,
    request: CreateTemplateRequest,
) -> Result<CreateAdminAppTemplateCommand, AdminAppCommandBuildError> {
    let template_code = normalize_code_required(
        request.template_code.as_deref(),
        "templateCode",
        MAX_TEMPLATE_CODE_LEN,
    )?;
    let template_no = request
        .template_no
        .as_deref()
        .map(|value| normalize_code(value, "templateNo", MAX_TEMPLATE_NO_LEN))
        .transpose()?
        .unwrap_or_else(|| template_code.clone());
    Ok(CreateAdminAppTemplateCommand {
        subject,
        template_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        template_no,
        template_code,
        template_name: normalize_required_text(
            request.template_name.as_deref(),
            "templateName",
            MAX_TEMPLATE_NAME_LEN,
        )?,
        description: normalize_optional_text(
            request.description.as_deref(),
            "description",
            MAX_DESCRIPTION_LEN,
        )?,
        category_id: request
            .category_id
            .as_ref()
            .map(|value| normalize_value_id(value, "categoryId"))
            .transpose()?,
        category_code: normalize_optional_code(
            request.category_code.as_deref(),
            "categoryCode",
            MAX_CATEGORY_CODE_LEN,
        )?,
        template_type: normalize_optional_code(
            request.template_type.as_deref(),
            "templateType",
            MAX_TEMPLATE_KIND_LEN,
        )?,
        runtime: normalize_optional_code(
            request.runtime.as_deref(),
            "runtime",
            MAX_TEMPLATE_KIND_LEN,
        )?,
        framework: normalize_optional_code(
            request.framework.as_deref(),
            "framework",
            MAX_TEMPLATE_KIND_LEN,
        )?,
        language: normalize_optional_code(
            request.language.as_deref(),
            "language",
            MAX_TEMPLATE_KIND_LEN,
        )?,
        icon: optional_media_resource(request.icon, "icon")?,
        cover: optional_media_resource(request.cover, "cover")?,
        visibility: request
            .visibility
            .as_deref()
            .map(normalize_template_visibility)
            .transpose()
            .map_err(AdminAppCommandBuildError::BadRequest)?
            .unwrap_or_else(|| "TENANT".to_owned()),
        publish_status: request
            .publish_status
            .as_deref()
            .map(normalize_template_publish_status)
            .transpose()
            .map_err(AdminAppCommandBuildError::BadRequest)?
            .unwrap_or_else(|| "DRAFT".to_owned()),
        featured: request.featured.unwrap_or(false),
        sort_weight: request.sort_weight.unwrap_or_default(),
        source_app_id: request
            .source_app_id
            .as_ref()
            .map(|value| normalize_value_id(value, "sourceAppId"))
            .transpose()?,
        git_repo_url: normalize_optional_git_repo_url(
            request.git_repo_url.as_deref(),
            "gitRepoUrl",
        )?,
        git_ref: normalize_optional_git_ref(request.git_ref.as_deref(), "gitRef")?,
        git_sub_path: normalize_optional_git_sub_path(
            request.git_sub_path.as_deref(),
            "gitSubPath",
        )?,
        app_config_schema: normalize_object_value(request.app_config_schema, "appConfigSchema")?,
        default_app_config: normalize_object_value(request.default_app_config, "defaultAppConfig")?,
        variable_schema: normalize_object_value(request.variable_schema, "variableSchema")?,
        dependency_manifest: normalize_array_value(
            request.dependency_manifest,
            "dependencyManifest",
        )?,
        capability_manifest: normalize_array_value(
            request.capability_manifest,
            "capabilityManifest",
        )?,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_create_category_command(
    state: AdminAppState,
    _headers: &HeaderMap,
    subject: AdminAppSubject,
    request: CreateCategoryRequest,
) -> Result<CreateAdminAppCategoryCommand, AdminAppCommandBuildError> {
    Ok(CreateAdminAppCategoryCommand {
        subject,
        category_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        name: normalize_required_text(request.name.as_deref(), "name", MAX_CATEGORY_NAME_LEN)?,
        description: normalize_optional_text(
            request.description.as_deref(),
            "description",
            MAX_DESCRIPTION_LEN,
        )?,
        code: normalize_optional_text(request.code.as_deref(), "code", MAX_CATEGORY_CODE_LEN)?,
        icon: optional_media_resource(request.icon, "icon")?,
        sort_weight: request.sort_weight.unwrap_or_default(),
        parent_id: request
            .parent_id
            .as_ref()
            .map(|value| normalize_value_id(value, "parentId"))
            .transpose()?,
        path: normalize_optional_text(request.path.as_deref(), "path", MAX_CATEGORY_PATH_LEN)?,
        visible: request.visible.unwrap_or(true),
        status: normalize_category_status(request.status.unwrap_or(1))?,
        category_type: APP_STORE_CATEGORY_TYPE,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_app_command(
    state: AdminAppState,
    _headers: &HeaderMap,
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
        icon: normalize_media_resource_option(request.icon, "icon")?,
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
        artifact: normalize_nullable_media_resource(request.artifact, "artifact")?,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_template_command(
    state: AdminAppState,
    _headers: &HeaderMap,
    subject: AdminAppSubject,
    template_id: String,
    request: UpdateTemplateRequest,
) -> Result<UpdateAdminAppTemplateCommand, AdminAppCommandBuildError> {
    Ok(UpdateAdminAppTemplateCommand {
        subject,
        template_id: normalize_id(&template_id, "templateId")?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        template_name: request
            .template_name
            .as_deref()
            .map(|value| {
                normalize_required_text(Some(value), "templateName", MAX_TEMPLATE_NAME_LEN)
            })
            .transpose()?,
        description: request
            .description
            .as_ref()
            .map(|value| normalize_nullable_text_value(value, "description", MAX_DESCRIPTION_LEN))
            .transpose()?,
        category_id: request
            .category_id
            .as_ref()
            .map(|value| normalize_nullable_value_id(value, "categoryId"))
            .transpose()?,
        category_code: request
            .category_code
            .as_ref()
            .map(|value| {
                normalize_nullable_code_value(value, "categoryCode", MAX_CATEGORY_CODE_LEN)
            })
            .transpose()?,
        template_type: request
            .template_type
            .as_ref()
            .map(|value| {
                normalize_nullable_code_value(value, "templateType", MAX_TEMPLATE_KIND_LEN)
            })
            .transpose()?,
        runtime: request
            .runtime
            .as_ref()
            .map(|value| normalize_nullable_code_value(value, "runtime", MAX_TEMPLATE_KIND_LEN))
            .transpose()?,
        framework: request
            .framework
            .as_ref()
            .map(|value| normalize_nullable_code_value(value, "framework", MAX_TEMPLATE_KIND_LEN))
            .transpose()?,
        language: request
            .language
            .as_ref()
            .map(|value| normalize_nullable_code_value(value, "language", MAX_TEMPLATE_KIND_LEN))
            .transpose()?,
        icon: normalize_nullable_media_resource(request.icon, "icon")?,
        cover: normalize_nullable_media_resource(request.cover, "cover")?,
        visibility: request
            .visibility
            .as_deref()
            .map(normalize_template_visibility)
            .transpose()
            .map_err(AdminAppCommandBuildError::BadRequest)?,
        publish_status: request
            .publish_status
            .as_deref()
            .map(normalize_template_publish_status)
            .transpose()
            .map_err(AdminAppCommandBuildError::BadRequest)?,
        featured: request.featured,
        sort_weight: request.sort_weight,
        source_app_id: request
            .source_app_id
            .as_ref()
            .map(|value| normalize_nullable_value_id(value, "sourceAppId"))
            .transpose()?,
        git_repo_url: request
            .git_repo_url
            .as_ref()
            .map(|value| normalize_nullable_git_repo_url_value(value, "gitRepoUrl"))
            .transpose()?,
        git_ref: request
            .git_ref
            .as_ref()
            .map(|value| normalize_nullable_git_ref_value(value, "gitRef"))
            .transpose()?,
        git_sub_path: request
            .git_sub_path
            .as_ref()
            .map(|value| normalize_nullable_git_sub_path_value(value, "gitSubPath"))
            .transpose()?,
        app_config_schema: request
            .app_config_schema
            .map(|value| normalize_object_value(Some(value), "appConfigSchema"))
            .transpose()?,
        default_app_config: request
            .default_app_config
            .map(|value| normalize_object_value(Some(value), "defaultAppConfig"))
            .transpose()?,
        variable_schema: request
            .variable_schema
            .map(|value| normalize_object_value(Some(value), "variableSchema"))
            .transpose()?,
        dependency_manifest: request
            .dependency_manifest
            .map(|value| normalize_array_value(Some(value), "dependencyManifest"))
            .transpose()?,
        capability_manifest: request
            .capability_manifest
            .map(|value| normalize_array_value(Some(value), "capabilityManifest"))
            .transpose()?,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_category_command(
    state: AdminAppState,
    _headers: &HeaderMap,
    subject: AdminAppSubject,
    category_id: String,
    request: UpdateCategoryRequest,
) -> Result<UpdateAdminAppCategoryCommand, AdminAppCommandBuildError> {
    let category_id = normalize_id(&category_id, "categoryId")?;
    let parent_id = request
        .parent_id
        .as_ref()
        .map(|value| normalize_nullable_value_id(value, "parentId"))
        .transpose()?;
    if matches!(parent_id, Some(Some(parent_id)) if parent_id == category_id) {
        return Err(AdminAppCommandBuildError::BadRequest(
            "category parent cannot reference itself".to_owned(),
        ));
    }
    Ok(UpdateAdminAppCategoryCommand {
        subject,
        category_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        name: request
            .name
            .as_deref()
            .map(|value| normalize_required_text(Some(value), "name", MAX_CATEGORY_NAME_LEN))
            .transpose()?,
        description: request
            .description
            .as_ref()
            .map(|value| normalize_nullable_text_value(value, "description", MAX_DESCRIPTION_LEN))
            .transpose()?,
        code: request
            .code
            .as_ref()
            .map(|value| normalize_nullable_text_value(value, "code", MAX_CATEGORY_CODE_LEN))
            .transpose()?,
        icon: normalize_nullable_media_resource(request.icon, "icon")?,
        sort_weight: request.sort_weight,
        parent_id,
        path: request
            .path
            .as_ref()
            .map(|value| normalize_nullable_text_value(value, "path", MAX_CATEGORY_PATH_LEN))
            .transpose()?,
        visible: request.visible,
        status: request.status.map(normalize_category_status).transpose()?,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_set_status_command(
    state: AdminAppState,
    _headers: &HeaderMap,
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
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_set_template_publish_status_command(
    state: AdminAppState,
    _headers: &HeaderMap,
    subject: AdminAppSubject,
    template_id: String,
    publish_status: &str,
) -> Result<SetAdminAppTemplatePublishStatusCommand, AdminAppCommandBuildError> {
    Ok(SetAdminAppTemplatePublishStatusCommand {
        subject,
        template_id: normalize_id(&template_id, "templateId")?,
        publish_status: normalize_template_publish_status(publish_status)
            .map_err(AdminAppCommandBuildError::BadRequest)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_delete_app_command(
    state: AdminAppState,
    _headers: &HeaderMap,
    subject: AdminAppSubject,
    app_id: String,
) -> Result<DeleteAdminAppCommand, AdminAppCommandBuildError> {
    Ok(DeleteAdminAppCommand {
        subject,
        app_id: normalize_id(&app_id, "appId")?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_delete_template_command(
    state: AdminAppState,
    _headers: &HeaderMap,
    subject: AdminAppSubject,
    template_id: String,
) -> Result<DeleteAdminAppTemplateCommand, AdminAppCommandBuildError> {
    Ok(DeleteAdminAppTemplateCommand {
        subject,
        template_id: normalize_id(&template_id, "templateId")?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_delete_category_command(
    state: AdminAppState,
    _headers: &HeaderMap,
    subject: AdminAppSubject,
    category_id: String,
) -> Result<DeleteAdminAppCategoryCommand, AdminAppCommandBuildError> {
    Ok(DeleteAdminAppCategoryCommand {
        subject,
        category_id: normalize_id(&category_id, "categoryId")?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: generate_server_request_id().map_err(request_id_error)?,
        requested_at: current_timestamp_string(),
    })
}

fn to_category_response(item: AdminAppCategoryItem) -> AdminAppCategoryItemResponse {
    AdminAppCategoryItemResponse {
        id: item.id.to_string(),
        name: item.name,
        description: item.description,
        code: item.code,
        icon: item.icon,
        sort_weight: item.sort_weight,
        parent_id: item.parent_id.map(|value| value.to_string()),
        path: item.path,
        visible: item.visible,
        status: item.status,
        category_type: item.category_type,
    }
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
        artifact: item.artifact,
        created_at: item.created_at,
        updated_at: item.updated_at,
    }
}

fn to_template_response(item: AdminAppTemplateItem) -> AdminAppTemplateItemResponse {
    AdminAppTemplateItemResponse {
        id: item.id.to_string(),
        uuid: item.uuid,
        template_no: item.template_no,
        template_code: item.template_code,
        template_name: item.template_name,
        description: item.description,
        category_id: item.category_id.map(|value| value.to_string()),
        category_code: item.category_code,
        template_type: item.template_type,
        runtime: item.runtime,
        framework: item.framework,
        language: item.language,
        icon: item.icon,
        cover: item.cover,
        visibility: item.visibility,
        publish_status: item.publish_status,
        featured: item.featured,
        sort_weight: item.sort_weight,
        source_app_id: item.source_app_id.map(|value| value.to_string()),
        git_repo_url: item.git_repo_url,
        git_ref: item.git_ref,
        git_sub_path: item.git_sub_path,
        current_version_id: item.current_version_id.map(|value| value.to_string()),
        app_config_schema: item.app_config_schema,
        default_app_config: item.default_app_config,
        variable_schema: item.variable_schema,
        dependency_manifest: item.dependency_manifest,
        capability_manifest: item.capability_manifest,
        created_at: item.created_at,
        updated_at: item.updated_at,
    }
}

fn normalize_category_status(value: i32) -> Result<i32, AdminAppCommandBuildError> {
    if (-1..=1).contains(&value) {
        Ok(value)
    } else {
        Err(AdminAppCommandBuildError::BadRequest(
            "status must be -1, 0, or 1".to_owned(),
        ))
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

fn normalize_optional_git_repo_url(
    value: Option<&str>,
    field: &str,
) -> Result<Option<String>, AdminAppCommandBuildError> {
    let Some(value) = normalize_optional_text(value, field, MAX_TEMPLATE_GIT_REPO_URL_LEN)? else {
        return Ok(None);
    };
    validate_git_repo_url(&value, field)?;
    Ok(Some(value))
}

fn normalize_nullable_git_repo_url_value(
    value: &Value,
    field: &str,
) -> Result<Option<String>, AdminAppCommandBuildError> {
    if value.is_null() {
        return Ok(None);
    }
    let Some(value) = value.as_str() else {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must be a string or null"
        )));
    };
    normalize_optional_git_repo_url(Some(value), field)
}

fn normalize_optional_git_ref(
    value: Option<&str>,
    field: &str,
) -> Result<Option<String>, AdminAppCommandBuildError> {
    let Some(value) = normalize_optional_text(value, field, MAX_TEMPLATE_GIT_REF_LEN)? else {
        return Ok(None);
    };
    validate_git_ref(&value, field)?;
    Ok(Some(value))
}

fn normalize_nullable_git_ref_value(
    value: &Value,
    field: &str,
) -> Result<Option<String>, AdminAppCommandBuildError> {
    if value.is_null() {
        return Ok(None);
    }
    let Some(value) = value.as_str() else {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must be a string or null"
        )));
    };
    normalize_optional_git_ref(Some(value), field)
}

fn normalize_optional_git_sub_path(
    value: Option<&str>,
    field: &str,
) -> Result<Option<String>, AdminAppCommandBuildError> {
    let Some(value) = normalize_optional_text(value, field, MAX_TEMPLATE_GIT_SUB_PATH_LEN)? else {
        return Ok(None);
    };
    if value == "." {
        return Ok(None);
    }
    validate_git_sub_path(&value, field)?;
    Ok(Some(value))
}

fn normalize_nullable_git_sub_path_value(
    value: &Value,
    field: &str,
) -> Result<Option<String>, AdminAppCommandBuildError> {
    if value.is_null() {
        return Ok(None);
    }
    let Some(value) = value.as_str() else {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must be a string or null"
        )));
    };
    normalize_optional_git_sub_path(Some(value), field)
}

fn validate_git_repo_url(value: &str, field: &str) -> Result<(), AdminAppCommandBuildError> {
    if value
        .chars()
        .any(|ch| ch.is_control() || ch.is_whitespace())
    {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must not contain whitespace or control characters"
        )));
    }
    let is_supported_url = value.starts_with("https://")
        || value.starts_with("http://")
        || value.starts_with("ssh://")
        || value.starts_with("git://");
    let is_scp_like = value.starts_with("git@")
        && value
            .split_once(':')
            .is_some_and(|(host, path)| host.len() > 4 && !path.is_empty());
    if !is_supported_url && !is_scp_like {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must be an http(s), ssh, git, or git@host:path repository URL"
        )));
    }
    Ok(())
}

fn validate_git_ref(value: &str, field: &str) -> Result<(), AdminAppCommandBuildError> {
    if value
        .chars()
        .any(|ch| ch.is_control() || ch.is_whitespace())
    {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must not contain whitespace or control characters"
        )));
    }
    if value.contains('\\') || value.contains("..") || value.ends_with('/') || value.ends_with('.')
    {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must be a valid branch, tag, or commit reference"
        )));
    }
    Ok(())
}

fn validate_git_sub_path(value: &str, field: &str) -> Result<(), AdminAppCommandBuildError> {
    if value.starts_with('/') || value.contains('\\') {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must be a relative repository path"
        )));
    }
    if value.chars().any(|ch| ch.is_control()) {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must not contain control characters"
        )));
    }
    if value
        .split('/')
        .any(|segment| segment.is_empty() || segment == "." || segment == "..")
    {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must not contain empty, dot, or parent path segments"
        )));
    }
    Ok(())
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

fn normalize_code_required(
    value: Option<&str>,
    field: &str,
    max_len: usize,
) -> Result<String, AdminAppCommandBuildError> {
    normalize_code(value.unwrap_or_default(), field, max_len)
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

fn normalize_object_value(
    value: Option<Value>,
    field: &str,
) -> Result<Value, AdminAppCommandBuildError> {
    match value {
        Some(value) if value.is_object() => Ok(value),
        Some(_) => Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must be a JSON object"
        ))),
        None => Ok(Value::Object(Default::default())),
    }
}

fn normalize_array_value(
    value: Option<Value>,
    field: &str,
) -> Result<Value, AdminAppCommandBuildError> {
    match value {
        Some(value) if value.is_array() => Ok(value),
        Some(_) => Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must be a JSON array"
        ))),
        None => Ok(Value::Array(Vec::new())),
    }
}

fn optional_media_resource(
    value: Option<Value>,
    field: &str,
) -> Result<Option<Value>, AdminAppCommandBuildError> {
    normalize_media_resource_option(value, field)
}

fn normalize_nullable_media_resource(
    value: Option<Value>,
    field: &str,
) -> Result<Option<Option<Value>>, AdminAppCommandBuildError> {
    let Some(value) = value else {
        return Ok(None);
    };
    if value.is_null() {
        return Ok(Some(None));
    }
    normalize_media_resource(value, field).map(Some)
}

fn normalize_media_resource_option(
    value: Option<Value>,
    field: &str,
) -> Result<Option<Value>, AdminAppCommandBuildError> {
    let Some(value) = value else {
        return Ok(None);
    };
    normalize_media_resource(value, field)
}

fn normalize_media_resource(
    value: Value,
    field: &str,
) -> Result<Option<Value>, AdminAppCommandBuildError> {
    if value.is_null() {
        return Ok(None);
    }
    let mut object = value.as_object().cloned().ok_or_else(|| {
        AdminAppCommandBuildError::BadRequest(format!("{field} must be a MediaResource object"))
    })?;
    let kind = media_resource_required_text(field, &object, "kind", MAX_MEDIA_LABEL_LEN)?;
    let source = media_resource_required_text(field, &object, "source", MAX_MEDIA_LABEL_LEN)?;
    object.insert("kind".to_owned(), Value::String(kind));
    object.insert("source".to_owned(), Value::String(source));

    let mut has_locator = false;
    for key in ["id", "publicUrl", "url", "uri", "objectKey", "objectBlobId"] {
        if let Some(value) = object.get_mut(key) {
            let Some(text) = value.as_str() else {
                return Err(AdminAppCommandBuildError::BadRequest(format!(
                    "{field}.{key} must be a string"
                )));
            };
            let normalized = normalize_optional_text(
                Some(text),
                &format!("{field}.{key}"),
                MAX_MEDIA_LOCATOR_LEN,
            )
            .map_err(AdminAppCommandBuildError::BadRequest)?;
            if let Some(normalized) = normalized {
                has_locator = true;
                *value = Value::String(normalized);
            } else {
                *value = Value::String(String::new());
            }
        }
    }
    if !has_locator {
        return Err(AdminAppCommandBuildError::BadRequest(format!(
            "{field} must include a media resource locator"
        )));
    }

    Ok(Some(Value::Object(object)))
}

fn media_resource_required_text(
    field: &str,
    object: &serde_json::Map<String, Value>,
    key: &str,
    max_len: usize,
) -> Result<String, AdminAppCommandBuildError> {
    let value = object.get(key).and_then(Value::as_str);
    normalize_required_text(value, &format!("{field}.{key}"), max_len)
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

fn normalize_template_visibility(value: &str) -> Result<String, String> {
    match value.trim() {
        "PRIVATE" => Ok("PRIVATE".to_owned()),
        "TENANT" => Ok("TENANT".to_owned()),
        "PUBLIC" => Ok("PUBLIC".to_owned()),
        _ => Err("visibility must be PRIVATE, TENANT, or PUBLIC".to_owned()),
    }
}

fn normalize_template_publish_status(value: &str) -> Result<String, String> {
    match value.trim() {
        "DRAFT" => Ok("DRAFT".to_owned()),
        "PUBLISHED" => Ok("PUBLISHED".to_owned()),
        "OFFLINE" => Ok("OFFLINE".to_owned()),
        _ => Err("publishStatus must be DRAFT, PUBLISHED, or OFFLINE".to_owned()),
    }
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

fn request_id_error(error: RequestIdError) -> AdminAppCommandBuildError {
    match error {
        RequestIdError::Invalid(message) => AdminAppCommandBuildError::BadRequest(message),
        RequestIdError::System(message) => {
            AdminAppCommandBuildError::System(DomainError::new(message))
        }
    }
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

#[cfg(test)]
mod tests {
    use super::*;

    fn subject() -> AdminAppSubject {
        AdminAppSubject {
            tenant_id: 10,
            organization_id: 20,
            operator_id: 30,
            operator_type: 1,
        }
    }

    #[test]
    fn app_sdk_query_maps_to_internal_list_request() {
        let request: ListAppsRequest = ListAppsQuery {
            q: Some("billing".to_owned()),
            status: Some("ACTIVE".to_owned()),
            market_status: Some("PUBLISHED".to_owned()),
            app_type: Some("console".to_owned()),
            category_id: Some(2001),
            page: Some(2),
            page_size: Some(50),
        }
        .into();
        let query = normalize_list_query(subject(), request)
            .unwrap_or_else(|_| panic!("app query should normalize"));

        assert_eq!(Some("billing".to_owned()), query.keyword);
        assert_eq!(Some("ACTIVE".to_owned()), query.status);
        assert_eq!(Some("PUBLISHED".to_owned()), query.market_status);
        assert_eq!(Some("console".to_owned()), query.app_type);
        assert_eq!(Some(2001), query.category_id);
        assert_eq!(Some(2), query.page_no);
        assert_eq!(Some(50), query.page_size);
    }
}
