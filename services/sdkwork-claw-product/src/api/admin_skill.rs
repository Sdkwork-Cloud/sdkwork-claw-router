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
    AdminSkillArtifactItem, AdminSkillAssetItem, AdminSkillCategoryItem, AdminSkillItem,
    AdminSkillPackageItem, AdminSkillStore, AdminSkillSubject, CreateAdminSkillArtifactCommand,
    CreateAdminSkillAssetCommand, CreateAdminSkillCategoryCommand, CreateAdminSkillCommand,
    CreateAdminSkillPackageCommand, DeleteAdminSkillArtifactCommand, DeleteAdminSkillAssetCommand,
    DeleteAdminSkillCommand, DeleteAdminSkillPackageCommand, ListAdminSkillArtifactsQuery,
    ListAdminSkillAssetsQuery, ListAdminSkillCategoriesQuery, ListAdminSkillPackagesQuery,
    ListAdminSkillsQuery, ReviewAdminSkillCommand, SetAdminSkillEnabledCommand,
    SetAdminSkillMarketStatusCommand, SetAdminSkillPackageEnabledCommand,
    UpdateAdminSkillArtifactCommand, UpdateAdminSkillAssetCommand, UpdateAdminSkillCommand,
    UpdateAdminSkillPackageCommand,
};

const REQUEST_ID_HEADER: &str = "X-Request-Id";
const MAX_REQUEST_ID_LEN: usize = 128;
const MAX_PAGE_SIZE: i64 = 200;
const MAX_NAME_LEN: usize = 255;
const MAX_KEY_LEN: usize = 128;
const MAX_CODE_LEN: usize = 128;
const MAX_SUMMARY_LEN: usize = 512;
const MAX_DESCRIPTION_LEN: usize = 4000;
const MAX_URL_LEN: usize = 500;
const MAX_ICON_LEN: usize = 255;
const MAX_VERSION_LEN: usize = 64;
const MAX_RUNTIME_LEN: usize = 64;
const MAX_ENTRYPOINT_LEN: usize = 255;
const MAX_LICENSE_LEN: usize = 128;
const MAX_PROVIDER_LEN: usize = 128;
const MAX_REVIEW_COMMENT_LEN: usize = 1000;
const MAX_MIME_TYPE_LEN: usize = 128;
const MAX_RESOURCE_REF_LEN: usize = 1024;
const MAX_RELEASE_NOTES_LEN: usize = 4000;
const MAX_ARRAY_ITEMS: usize = 64;
const MAX_ARRAY_ITEM_LEN: usize = 64;
const MAX_JSON_BYTES: usize = 64 * 1024;
const CATEGORY_TYPE_SKILLS: i32 = 19;

#[derive(Clone)]
struct AdminSkillState {
    store: Arc<dyn AdminSkillStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateCategoryRequest {
    name: Option<String>,
    description: Option<String>,
    code: Option<String>,
    icon: Option<String>,
    sort_weight: Option<i32>,
    parent_id: Option<Value>,
    path: Option<String>,
    visible: Option<bool>,
    status: Option<i32>,
    #[serde(rename = "type")]
    category_type: Option<i32>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ListPackagesRequest {
    keyword: Option<String>,
    enabled: Option<bool>,
    category_id: Option<Value>,
    page_no: Option<i64>,
    page_size: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreatePackageRequest {
    package_key: Option<String>,
    name: Option<String>,
    summary: Option<String>,
    description: Option<String>,
    icon: Option<String>,
    cover_image: Option<String>,
    category_id: Option<Value>,
    enabled: Option<bool>,
    featured: Option<bool>,
    sort_weight: Option<i32>,
    tags: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdatePackageRequest {
    package_key: Option<String>,
    name: Option<String>,
    summary: Option<String>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    description: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    icon: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    cover_image: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    category_id: Option<Value>,
    enabled: Option<bool>,
    featured: Option<bool>,
    sort_weight: Option<i32>,
    tags: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ListSkillsRequest {
    keyword: Option<String>,
    market_status: Option<String>,
    review_status: Option<String>,
    visibility: Option<String>,
    enabled: Option<bool>,
    category_id: Option<Value>,
    page_no: Option<i64>,
    page_size: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateSkillRequest {
    skill_key: Option<String>,
    name: Option<String>,
    summary: Option<String>,
    description: Option<String>,
    icon: Option<String>,
    cover_image: Option<String>,
    category_id: Option<Value>,
    package_id: Option<Value>,
    provider: Option<String>,
    version: Option<String>,
    version_name: Option<String>,
    runtime: Option<String>,
    entrypoint: Option<String>,
    manifest_url: Option<String>,
    repository_url: Option<String>,
    homepage_url: Option<String>,
    documentation_url: Option<String>,
    license_name: Option<String>,
    source_type: Option<String>,
    market_status: Option<String>,
    visibility: Option<String>,
    review_status: Option<String>,
    builtin: Option<bool>,
    is_builtin: Option<bool>,
    enabled: Option<bool>,
    featured: Option<bool>,
    recommend_weight: Option<i32>,
    price: Option<Value>,
    currency: Option<String>,
    tags: Option<Vec<String>>,
    capabilities: Option<Vec<String>>,
    config_schema: Option<Value>,
    default_config: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateSkillRequest {
    skill_key: Option<String>,
    name: Option<String>,
    summary: Option<String>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    description: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    icon: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    cover_image: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    category_id: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    package_id: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    provider: Option<Value>,
    version: Option<String>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    version_name: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    runtime: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    entrypoint: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    manifest_url: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    repository_url: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    homepage_url: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    documentation_url: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    license_name: Option<Value>,
    source_type: Option<String>,
    visibility: Option<String>,
    builtin: Option<bool>,
    is_builtin: Option<bool>,
    featured: Option<bool>,
    recommend_weight: Option<i32>,
    price: Option<Value>,
    currency: Option<String>,
    tags: Option<Vec<String>>,
    capabilities: Option<Vec<String>>,
    config_schema: Option<Value>,
    default_config: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReviewSkillRequest {
    comment: Option<String>,
    review_comment: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateSkillAssetRequest {
    artifact_id: Option<Value>,
    asset_type: Option<i32>,
    asset_url: Option<String>,
    thumbnail_url: Option<String>,
    title: Option<String>,
    alt_text: Option<String>,
    mime_type: Option<String>,
    width: Option<i32>,
    height: Option<i32>,
    duration_seconds: Option<String>,
    file_size: Option<i64>,
    sort_order: Option<i32>,
    status: Option<i32>,
    published_at: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateSkillAssetRequest {
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    artifact_id: Option<Value>,
    asset_type: Option<i32>,
    asset_url: Option<String>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    thumbnail_url: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    title: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    alt_text: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    mime_type: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    width: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    height: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    duration_seconds: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    file_size: Option<Value>,
    sort_order: Option<i32>,
    status: Option<i32>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    published_at: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateSkillArtifactRequest {
    artifact_type: Option<i32>,
    version: Option<String>,
    platform_type: Option<String>,
    os_name: Option<String>,
    artifact_ref: Option<String>,
    artifact_url: Option<String>,
    artifact_size_bytes: Option<i64>,
    runtime: Option<String>,
    frameworks: Option<Vec<String>>,
    license_name: Option<String>,
    checksum_hash: Option<String>,
    release_notes: Option<String>,
    status: Option<i32>,
    published_at: Option<String>,
    deprecated_at: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateSkillArtifactRequest {
    artifact_type: Option<i32>,
    version: Option<String>,
    platform_type: Option<String>,
    os_name: Option<String>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    artifact_ref: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    artifact_url: Option<Value>,
    artifact_size_bytes: Option<i64>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    runtime: Option<Value>,
    frameworks: Option<Vec<String>>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    license_name: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    checksum_hash: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    release_notes: Option<Value>,
    status: Option<i32>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    published_at: Option<Value>,
    #[serde(default, deserialize_with = "deserialize_optional_json_value")]
    deprecated_at: Option<Value>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminSkillListResponse<T> {
    items: Vec<T>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminSkillItemEnvelope<T> {
    item: T,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminSkillDeleteResponse {
    deleted: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminSkillCategoryItemResponse {
    id: String,
    name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    icon: Option<String>,
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
struct AdminSkillPackageItemResponse {
    id: String,
    package_key: String,
    name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    summary: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    icon: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    cover_image: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    category_id: Option<String>,
    enabled: bool,
    featured: bool,
    sort_weight: i32,
    tags: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    latest_published_at: Option<String>,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminSkillItemResponse {
    id: String,
    skill_key: String,
    name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    summary: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    icon: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    cover_image: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    category_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    package_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    provider: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    version_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    runtime: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    entrypoint: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    manifest_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    repository_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    homepage_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    documentation_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    license_name: Option<String>,
    source_type: String,
    market_status: String,
    visibility: String,
    review_status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    review_comment: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    reviewed_by: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    reviewed_at: Option<String>,
    builtin: bool,
    is_builtin: bool,
    enabled: bool,
    featured: bool,
    recommend_weight: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    price: Option<String>,
    currency: String,
    install_count: String,
    rating_avg: String,
    rating_count: String,
    tags: Vec<String>,
    capabilities: Vec<String>,
    config_schema: Value,
    default_config: Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    latest_published_at: Option<String>,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminSkillAssetItemResponse {
    id: String,
    skill_id: String,
    target_type: i32,
    target_id: String,
    artifact_id: Option<String>,
    asset_type: i32,
    asset_url: String,
    thumbnail_url: Option<String>,
    title: Option<String>,
    alt_text: Option<String>,
    mime_type: Option<String>,
    width: Option<i32>,
    height: Option<i32>,
    duration_seconds: Option<String>,
    file_size: Option<i64>,
    sort_order: i32,
    status: i32,
    published_at: Option<String>,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminSkillArtifactItemResponse {
    id: String,
    skill_id: String,
    target_type: i32,
    target_id: String,
    artifact_type: i32,
    version: String,
    platform_type: String,
    os_name: String,
    artifact_ref: Option<String>,
    artifact_url: Option<String>,
    artifact_size_bytes: i64,
    runtime: Option<String>,
    frameworks: Vec<String>,
    license_name: Option<String>,
    checksum_hash: Option<String>,
    release_notes: Option<String>,
    status: i32,
    published_at: Option<String>,
    deprecated_at: Option<String>,
    created_at: String,
    updated_at: String,
}

enum AdminSkillCommandBuildError {
    BadRequest(String),
    System(DomainError),
}

pub fn admin_skill_router_with_store(
    store: Arc<dyn AdminSkillStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/skill/categories",
            get(fetch_categories).post(create_category),
        )
        .route("/backend/v3/api/skill/package/list", post(fetch_packages))
        .route("/backend/v3/api/skill/package", post(create_package))
        .route(
            "/backend/v3/api/skill/package/{package_id}",
            get(fetch_package)
                .put(update_package)
                .delete(delete_package),
        )
        .route(
            "/backend/v3/api/skill/package/{package_id}/enable",
            post(enable_package),
        )
        .route(
            "/backend/v3/api/skill/package/{package_id}/disable",
            post(disable_package),
        )
        .route("/backend/v3/api/skill/list", post(fetch_skills))
        .route("/backend/v3/api/skill", post(create_skill))
        .route(
            "/backend/v3/api/skill/{skill_id}",
            get(fetch_skill).put(update_skill).delete(delete_skill),
        )
        .route(
            "/backend/v3/api/skill/{skill_id}/assets",
            get(fetch_skill_assets).post(create_skill_asset),
        )
        .route(
            "/backend/v3/api/skill/{skill_id}/assets/{asset_id}",
            get(fetch_skill_asset)
                .put(update_skill_asset)
                .delete(delete_skill_asset),
        )
        .route(
            "/backend/v3/api/skill/{skill_id}/artifacts",
            get(fetch_skill_artifacts).post(create_skill_artifact),
        )
        .route(
            "/backend/v3/api/skill/{skill_id}/artifacts/{artifact_id}",
            get(fetch_skill_artifact)
                .put(update_skill_artifact)
                .delete(delete_skill_artifact),
        )
        .route(
            "/backend/v3/api/skill/{skill_id}/enable",
            post(enable_skill),
        )
        .route(
            "/backend/v3/api/skill/{skill_id}/disable",
            post(disable_skill),
        )
        .route(
            "/backend/v3/api/skill/{skill_id}/publish",
            post(publish_skill),
        )
        .route(
            "/backend/v3/api/skill/{skill_id}/offline",
            post(offline_skill),
        )
        .route(
            "/backend/v3/api/skill/{skill_id}/review/approve",
            post(approve_skill),
        )
        .route(
            "/backend/v3/api/skill/{skill_id}/review/reject",
            post(reject_skill),
        )
        .with_state(AdminSkillState {
            store,
            entity_uuid_generator,
        })
}

async fn fetch_categories(State(state): State<AdminSkillState>, headers: HeaderMap) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .store
        .list_categories(ListAdminSkillCategoriesQuery { subject })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AdminSkillListResponse {
            items: items.into_iter().map(to_category_response).collect(),
        }))
        .into_response(),
        Err(error) => {
            admin_skill_system_response("skill category read model is unavailable", error)
        }
    }
}

async fn create_category(
    State(state): State<AdminSkillState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<CreateCategoryRequest>(&body, "skill category") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_category_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.create_category(command).await {
        Ok(item) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
            item: to_category_response(item),
        }))
        .into_response(),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => {
            admin_skill_system_response("skill category command store is unavailable", error)
        }
    }
}

async fn fetch_packages(
    State(state): State<AdminSkillState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_optional_json_body::<ListPackagesRequest>(&body, "skill package list")
    {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let query = match build_list_packages_query(subject, request) {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };
    match state.store.list_packages(query).await {
        Ok(items) => Json(PlusApiResult::success(AdminSkillListResponse {
            items: items.into_iter().map(to_package_response).collect(),
        }))
        .into_response(),
        Err(error) => admin_skill_system_response("skill package read model is unavailable", error),
    }
}

async fn fetch_package(
    State(state): State<AdminSkillState>,
    Path(package_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let package_id = match parse_positive_id(&package_id, "skill package id") {
        Ok(package_id) => package_id,
        Err(message) => return bad_request(message),
    };
    match state
        .store
        .get_package(empty_package_list_query(subject), package_id)
        .await
    {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
            item: to_package_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("skill package was not found"),
        Err(error) => admin_skill_system_response("skill package read model is unavailable", error),
    }
}

async fn create_package(
    State(state): State<AdminSkillState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<CreatePackageRequest>(&body, "skill package") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_package_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.create_package(command).await {
        Ok(item) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
            item: to_package_response(item),
        }))
        .into_response(),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => {
            admin_skill_system_response("skill package command store is unavailable", error)
        }
    }
}

async fn update_package(
    State(state): State<AdminSkillState>,
    Path(package_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let package_id = match parse_positive_id(&package_id, "skill package id") {
        Ok(package_id) => package_id,
        Err(message) => return bad_request(message),
    };
    let request = match parse_json_body::<UpdatePackageRequest>(&body, "skill package update") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command =
        match build_update_package_command(state.clone(), &headers, subject, package_id, request) {
            Ok(command) => command,
            Err(error) => return command_build_error_response(error),
        };
    package_item_command_response(
        state.store.update_package(command).await,
        "skill package was not found",
    )
}

async fn delete_package(
    State(state): State<AdminSkillState>,
    Path(package_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let package_id = match parse_positive_id(&package_id, "skill package id") {
        Ok(package_id) => package_id,
        Err(message) => return bad_request(message),
    };
    let command = match build_delete_package_command(state.clone(), &headers, subject, package_id) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.delete_package(command).await {
        Ok(true) => Json(PlusApiResult::success(AdminSkillDeleteResponse {
            deleted: true,
        }))
        .into_response(),
        Ok(false) => not_found_response("skill package was not found"),
        Err(error) => {
            admin_skill_system_response("skill package delete store is unavailable", error)
        }
    }
}

async fn enable_package(
    State(state): State<AdminSkillState>,
    Path(package_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    set_package_enabled_response(state, headers, package_id, true).await
}

async fn disable_package(
    State(state): State<AdminSkillState>,
    Path(package_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    set_package_enabled_response(state, headers, package_id, false).await
}

async fn fetch_skills(
    State(state): State<AdminSkillState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_optional_json_body::<ListSkillsRequest>(&body, "skill list") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let query = match build_list_query(subject, request) {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };
    match state.store.list_skills(query).await {
        Ok(items) => Json(PlusApiResult::success(AdminSkillListResponse {
            items: items.into_iter().map(to_skill_response).collect(),
        }))
        .into_response(),
        Err(error) => admin_skill_system_response("skill read model is unavailable", error),
    }
}

async fn fetch_skill(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    match state
        .store
        .get_skill(empty_list_query(subject), skill_id)
        .await
    {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
            item: to_skill_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("skill was not found"),
        Err(error) => admin_skill_system_response("skill read model is unavailable", error),
    }
}

async fn create_skill(
    State(state): State<AdminSkillState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<CreateSkillRequest>(&body, "skill") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_skill_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.create_skill(command).await {
        Ok(item) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
            item: to_skill_response(item),
        }))
        .into_response(),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => admin_skill_system_response("skill command store is unavailable", error),
    }
}

async fn update_skill(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let request = match parse_json_body::<UpdateSkillRequest>(&body, "skill update") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command =
        match build_update_skill_command(state.clone(), &headers, subject, skill_id, request) {
            Ok(command) => command,
            Err(error) => return command_build_error_response(error),
        };
    match state.store.update_skill(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
            item: to_skill_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("skill was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => admin_skill_system_response("skill update store is unavailable", error),
    }
}

async fn delete_skill(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let command = match build_delete_skill_command(state.clone(), &headers, subject, skill_id) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.delete_skill(command).await {
        Ok(true) => Json(PlusApiResult::success(AdminSkillDeleteResponse {
            deleted: true,
        }))
        .into_response(),
        Ok(false) => not_found_response("skill was not found"),
        Err(error) => admin_skill_system_response("skill delete store is unavailable", error),
    }
}

async fn enable_skill(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    set_enabled_response(state, headers, skill_id, true).await
}

async fn disable_skill(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    set_enabled_response(state, headers, skill_id, false).await
}

async fn publish_skill(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    set_market_status_response(state, headers, skill_id, "PUBLISHED", true).await
}

async fn offline_skill(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    set_market_status_response(state, headers, skill_id, "OFFLINE", false).await
}

async fn approve_skill(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    review_skill_response(state, headers, skill_id, body, "APPROVED").await
}

async fn reject_skill(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    review_skill_response(state, headers, skill_id, body, "REJECTED").await
}

async fn fetch_skill_assets(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    match state
        .store
        .list_assets(ListAdminSkillAssetsQuery { subject, skill_id })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AdminSkillListResponse {
            items: items.into_iter().map(to_asset_response).collect(),
        }))
        .into_response(),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => admin_skill_system_response("skill asset read model is unavailable", error),
    }
}

async fn fetch_skill_asset(
    State(state): State<AdminSkillState>,
    Path((skill_id, asset_id)): Path<(String, String)>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let asset_id = match parse_positive_id(&asset_id, "skill asset id") {
        Ok(asset_id) => asset_id,
        Err(message) => return bad_request(message),
    };
    match state
        .store
        .list_assets(ListAdminSkillAssetsQuery { subject, skill_id })
        .await
    {
        Ok(items) => match items.into_iter().find(|item| item.id == asset_id) {
            Some(item) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
                item: to_asset_response(item),
            }))
            .into_response(),
            None => not_found_response("skill asset was not found"),
        },
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => admin_skill_system_response("skill asset read model is unavailable", error),
    }
}

async fn create_skill_asset(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let request = match parse_json_body::<CreateSkillAssetRequest>(&body, "skill asset") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command =
        match build_create_asset_command(state.clone(), &headers, subject, skill_id, request) {
            Ok(command) => command,
            Err(error) => return command_build_error_response(error),
        };
    match state.store.create_asset(command).await {
        Ok(item) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
            item: to_asset_response(item),
        }))
        .into_response(),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => {
            admin_skill_system_response("skill asset command store is unavailable", error)
        }
    }
}

async fn update_skill_asset(
    State(state): State<AdminSkillState>,
    Path((skill_id, asset_id)): Path<(String, String)>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let asset_id = match parse_positive_id(&asset_id, "skill asset id") {
        Ok(asset_id) => asset_id,
        Err(message) => return bad_request(message),
    };
    let request = match parse_json_body::<UpdateSkillAssetRequest>(&body, "skill asset update") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_update_asset_command(
        state.clone(),
        &headers,
        subject,
        skill_id,
        asset_id,
        request,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    asset_item_command_response(
        state.store.update_asset(command).await,
        "skill asset was not found",
    )
}

async fn delete_skill_asset(
    State(state): State<AdminSkillState>,
    Path((skill_id, asset_id)): Path<(String, String)>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let asset_id = match parse_positive_id(&asset_id, "skill asset id") {
        Ok(asset_id) => asset_id,
        Err(message) => return bad_request(message),
    };
    let command =
        match build_delete_asset_command(state.clone(), &headers, subject, skill_id, asset_id) {
            Ok(command) => command,
            Err(error) => return command_build_error_response(error),
        };
    match state.store.delete_asset(command).await {
        Ok(true) => Json(PlusApiResult::success(AdminSkillDeleteResponse {
            deleted: true,
        }))
        .into_response(),
        Ok(false) => not_found_response("skill asset was not found"),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => admin_skill_system_response("skill asset delete store is unavailable", error),
    }
}

async fn fetch_skill_artifacts(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    match state
        .store
        .list_artifacts(ListAdminSkillArtifactsQuery { subject, skill_id })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AdminSkillListResponse {
            items: items.into_iter().map(to_artifact_response).collect(),
        }))
        .into_response(),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => {
            admin_skill_system_response("skill artifact read model is unavailable", error)
        }
    }
}

async fn fetch_skill_artifact(
    State(state): State<AdminSkillState>,
    Path((skill_id, artifact_id)): Path<(String, String)>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let artifact_id = match parse_positive_id(&artifact_id, "skill artifact id") {
        Ok(artifact_id) => artifact_id,
        Err(message) => return bad_request(message),
    };
    match state
        .store
        .list_artifacts(ListAdminSkillArtifactsQuery { subject, skill_id })
        .await
    {
        Ok(items) => match items.into_iter().find(|item| item.id == artifact_id) {
            Some(item) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
                item: to_artifact_response(item),
            }))
            .into_response(),
            None => not_found_response("skill artifact was not found"),
        },
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => {
            admin_skill_system_response("skill artifact read model is unavailable", error)
        }
    }
}

async fn create_skill_artifact(
    State(state): State<AdminSkillState>,
    Path(skill_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let request = match parse_json_body::<CreateSkillArtifactRequest>(&body, "skill artifact") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command =
        match build_create_artifact_command(state.clone(), &headers, subject, skill_id, request) {
            Ok(command) => command,
            Err(error) => return command_build_error_response(error),
        };
    match state.store.create_artifact(command).await {
        Ok(item) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
            item: to_artifact_response(item),
        }))
        .into_response(),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => {
            admin_skill_system_response("skill artifact command store is unavailable", error)
        }
    }
}

async fn update_skill_artifact(
    State(state): State<AdminSkillState>,
    Path((skill_id, artifact_id)): Path<(String, String)>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let artifact_id = match parse_positive_id(&artifact_id, "skill artifact id") {
        Ok(artifact_id) => artifact_id,
        Err(message) => return bad_request(message),
    };
    let request =
        match parse_json_body::<UpdateSkillArtifactRequest>(&body, "skill artifact update") {
            Ok(request) => request,
            Err(message) => return bad_request(message),
        };
    let command = match build_update_artifact_command(
        state.clone(),
        &headers,
        subject,
        skill_id,
        artifact_id,
        request,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    artifact_item_command_response(
        state.store.update_artifact(command).await,
        "skill artifact was not found",
    )
}

async fn delete_skill_artifact(
    State(state): State<AdminSkillState>,
    Path((skill_id, artifact_id)): Path<(String, String)>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let artifact_id = match parse_positive_id(&artifact_id, "skill artifact id") {
        Ok(artifact_id) => artifact_id,
        Err(message) => return bad_request(message),
    };
    let command = match build_delete_artifact_command(
        state.clone(),
        &headers,
        subject,
        skill_id,
        artifact_id,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.delete_artifact(command).await {
        Ok(true) => Json(PlusApiResult::success(AdminSkillDeleteResponse {
            deleted: true,
        }))
        .into_response(),
        Ok(false) => not_found_response("skill artifact was not found"),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => {
            admin_skill_system_response("skill artifact delete store is unavailable", error)
        }
    }
}

async fn set_package_enabled_response(
    state: AdminSkillState,
    headers: HeaderMap,
    package_id: String,
    enabled: bool,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let package_id = match parse_positive_id(&package_id, "skill package id") {
        Ok(package_id) => package_id,
        Err(message) => return bad_request(message),
    };
    let command = match build_set_package_enabled_command(
        state.clone(),
        &headers,
        subject,
        package_id,
        enabled,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    package_item_command_response(
        state.store.set_package_enabled(command).await,
        "skill package was not found",
    )
}

async fn set_enabled_response(
    state: AdminSkillState,
    headers: HeaderMap,
    skill_id: String,
    enabled: bool,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let command =
        match build_set_enabled_command(state.clone(), &headers, subject, skill_id, enabled) {
            Ok(command) => command,
            Err(error) => return command_build_error_response(error),
        };
    item_command_response(
        state.store.set_skill_enabled(command).await,
        "skill was not found",
    )
}

async fn set_market_status_response(
    state: AdminSkillState,
    headers: HeaderMap,
    skill_id: String,
    market_status: &str,
    publish: bool,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let command = match build_set_market_status_command(
        state.clone(),
        &headers,
        subject,
        skill_id,
        market_status,
        publish,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    item_command_response(
        state.store.set_market_status(command).await,
        "skill was not found",
    )
}

async fn review_skill_response(
    state: AdminSkillState,
    headers: HeaderMap,
    skill_id: String,
    body: Bytes,
    review_status: &str,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let skill_id = match parse_positive_id(&skill_id, "skill id") {
        Ok(skill_id) => skill_id,
        Err(message) => return bad_request(message),
    };
    let request = match parse_optional_json_body::<ReviewSkillRequest>(&body, "skill review") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_review_command(
        state.clone(),
        &headers,
        subject,
        skill_id,
        review_status,
        request,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    item_command_response(
        state.store.review_skill(command).await,
        "skill was not found",
    )
}

fn resolve_subject(headers: &HeaderMap) -> Result<AdminSkillSubject, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| AdminSkillSubject {
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
        return Err(format!(
            "{entity_name} request body must be at most {MAX_JSON_BYTES} bytes"
        ));
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
        return Err(format!(
            "{entity_name} request body must be at most {MAX_JSON_BYTES} bytes"
        ));
    }
    if body.iter().all(u8::is_ascii_whitespace) {
        return Ok(T::default());
    }
    serde_json::from_slice(body)
        .map_err(|error| format!("invalid {entity_name} request body: {error}"))
}

fn deserialize_optional_json_value<'de, D>(deserializer: D) -> Result<Option<Value>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    Value::deserialize(deserializer).map(Some)
}

impl Default for ListSkillsRequest {
    fn default() -> Self {
        Self {
            keyword: None,
            market_status: None,
            review_status: None,
            visibility: None,
            enabled: None,
            category_id: None,
            page_no: None,
            page_size: None,
        }
    }
}

impl Default for ListPackagesRequest {
    fn default() -> Self {
        Self {
            keyword: None,
            enabled: None,
            category_id: None,
            page_no: None,
            page_size: None,
        }
    }
}

impl Default for ReviewSkillRequest {
    fn default() -> Self {
        Self {
            comment: None,
            review_comment: None,
        }
    }
}

fn build_create_category_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    request: CreateCategoryRequest,
) -> Result<CreateAdminSkillCategoryCommand, AdminSkillCommandBuildError> {
    let name = required_text(request.name.as_deref(), "category name", MAX_NAME_LEN)?;
    let code = normalize_optional_code(request.code.as_deref(), "category code", MAX_CODE_LEN)?;
    let path = request
        .path
        .as_deref()
        .map(|value| normalize_path(value, "category path"))
        .transpose()?;
    let parent_id = normalize_optional_id_value(request.parent_id.as_ref(), "parentId")?;
    Ok(CreateAdminSkillCategoryCommand {
        subject,
        category_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        name,
        description: optional_text(
            request.description.as_deref(),
            "category description",
            MAX_SUMMARY_LEN,
        )?,
        code,
        icon: optional_url_or_path(request.icon.as_deref(), "category icon", MAX_ICON_LEN)?,
        sort_weight: request.sort_weight.unwrap_or(0),
        parent_id,
        path,
        visible: request.visible.unwrap_or(true),
        status: request.status.unwrap_or(1),
        category_type: request.category_type.unwrap_or(CATEGORY_TYPE_SKILLS),
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_list_query(
    subject: AdminSkillSubject,
    request: ListSkillsRequest,
) -> Result<ListAdminSkillsQuery, String> {
    let page_no = match request.page_no {
        Some(value) if value <= 0 => return Err("pageNo must be a positive integer".to_owned()),
        value => value,
    };
    let page_size = match request.page_size {
        Some(value) if value <= 0 => return Err("pageSize must be a positive integer".to_owned()),
        Some(value) if value > MAX_PAGE_SIZE => {
            return Err(format!("pageSize must be at most {MAX_PAGE_SIZE}"))
        }
        value => value,
    };
    Ok(ListAdminSkillsQuery {
        subject,
        keyword: normalize_optional_text(request.keyword.as_deref(), MAX_NAME_LEN),
        market_status: request
            .market_status
            .as_deref()
            .map(normalize_market_status)
            .transpose()?,
        review_status: request
            .review_status
            .as_deref()
            .map(normalize_review_status)
            .transpose()?,
        visibility: request
            .visibility
            .as_deref()
            .map(normalize_visibility)
            .transpose()?,
        enabled: request.enabled,
        category_id: normalize_optional_id_value(request.category_id.as_ref(), "categoryId")?,
        page_no,
        page_size,
    })
}

fn build_list_packages_query(
    subject: AdminSkillSubject,
    request: ListPackagesRequest,
) -> Result<ListAdminSkillPackagesQuery, String> {
    let page_no = match request.page_no {
        Some(value) if value <= 0 => return Err("pageNo must be a positive integer".to_owned()),
        value => value,
    };
    let page_size = match request.page_size {
        Some(value) if value <= 0 => return Err("pageSize must be a positive integer".to_owned()),
        Some(value) if value > MAX_PAGE_SIZE => {
            return Err(format!("pageSize must be at most {MAX_PAGE_SIZE}"))
        }
        value => value,
    };
    Ok(ListAdminSkillPackagesQuery {
        subject,
        keyword: normalize_optional_text(request.keyword.as_deref(), MAX_NAME_LEN),
        enabled: request.enabled,
        category_id: normalize_optional_id_value(request.category_id.as_ref(), "categoryId")?,
        page_no,
        page_size,
    })
}

fn empty_list_query(subject: AdminSkillSubject) -> ListAdminSkillsQuery {
    ListAdminSkillsQuery {
        subject,
        keyword: None,
        market_status: None,
        review_status: None,
        visibility: None,
        enabled: None,
        category_id: None,
        page_no: Some(1),
        page_size: Some(MAX_PAGE_SIZE),
    }
}

fn empty_package_list_query(subject: AdminSkillSubject) -> ListAdminSkillPackagesQuery {
    ListAdminSkillPackagesQuery {
        subject,
        keyword: None,
        enabled: None,
        category_id: None,
        page_no: Some(1),
        page_size: Some(MAX_PAGE_SIZE),
    }
}

fn build_create_package_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    request: CreatePackageRequest,
) -> Result<CreateAdminSkillPackageCommand, AdminSkillCommandBuildError> {
    let package_key =
        normalize_required_code(request.package_key.as_deref(), "packageKey", MAX_KEY_LEN)?;
    let name = required_text(request.name.as_deref(), "skill package name", MAX_NAME_LEN)?;
    Ok(CreateAdminSkillPackageCommand {
        subject,
        package_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        package_key,
        name,
        summary: optional_text(
            request.summary.as_deref(),
            "skill package summary",
            MAX_SUMMARY_LEN,
        )?,
        description: optional_text(
            request.description.as_deref(),
            "skill package description",
            MAX_DESCRIPTION_LEN,
        )?,
        icon: optional_url_or_path(request.icon.as_deref(), "skill package icon", MAX_ICON_LEN)?,
        cover_image: optional_url_or_path(
            request.cover_image.as_deref(),
            "skill package coverImage",
            MAX_ICON_LEN,
        )?,
        category_id: normalize_optional_id_value(request.category_id.as_ref(), "categoryId")?,
        enabled: request.enabled.unwrap_or(true),
        featured: request.featured.unwrap_or(false),
        sort_weight: request.sort_weight.unwrap_or(0),
        tags: normalize_string_array(request.tags, "tags")?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_package_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    package_id: i64,
    request: UpdatePackageRequest,
) -> Result<UpdateAdminSkillPackageCommand, AdminSkillCommandBuildError> {
    let command = UpdateAdminSkillPackageCommand {
        subject,
        package_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        package_key: request
            .package_key
            .as_deref()
            .map(|value| normalize_required_code(Some(value), "packageKey", MAX_KEY_LEN))
            .transpose()?,
        name: request
            .name
            .as_deref()
            .map(|value| required_text(Some(value), "skill package name", MAX_NAME_LEN))
            .transpose()?,
        summary: request
            .summary
            .as_deref()
            .map(|value| required_text(Some(value), "skill package summary", MAX_SUMMARY_LEN))
            .transpose()?,
        description: normalize_nullable_text(
            request.description.as_ref(),
            "skill package description",
            MAX_DESCRIPTION_LEN,
        )?,
        icon: normalize_nullable_url_or_path(
            request.icon.as_ref(),
            "skill package icon",
            MAX_ICON_LEN,
        )?,
        cover_image: normalize_nullable_url_or_path(
            request.cover_image.as_ref(),
            "skill package coverImage",
            MAX_ICON_LEN,
        )?,
        category_id: normalize_nullable_id_value(request.category_id.as_ref(), "categoryId")?,
        enabled: request.enabled,
        featured: request.featured,
        sort_weight: request.sort_weight,
        tags: request
            .tags
            .map(|values| normalize_string_array(Some(values), "tags"))
            .transpose()?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    };

    if command.package_key.is_none()
        && command.name.is_none()
        && command.summary.is_none()
        && command.description.is_none()
        && command.icon.is_none()
        && command.cover_image.is_none()
        && command.category_id.is_none()
        && command.enabled.is_none()
        && command.featured.is_none()
        && command.sort_weight.is_none()
        && command.tags.is_none()
    {
        return Err(AdminSkillCommandBuildError::BadRequest(
            "skill package update must include at least one editable field".to_owned(),
        ));
    }
    Ok(command)
}

fn build_set_package_enabled_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    package_id: i64,
    enabled: bool,
) -> Result<SetAdminSkillPackageEnabledCommand, AdminSkillCommandBuildError> {
    Ok(SetAdminSkillPackageEnabledCommand {
        subject,
        package_id,
        enabled,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_delete_package_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    package_id: i64,
) -> Result<DeleteAdminSkillPackageCommand, AdminSkillCommandBuildError> {
    Ok(DeleteAdminSkillPackageCommand {
        subject,
        package_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_create_skill_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    request: CreateSkillRequest,
) -> Result<CreateAdminSkillCommand, AdminSkillCommandBuildError> {
    let skill_key = normalize_required_code(request.skill_key.as_deref(), "skillKey", MAX_KEY_LEN)?;
    let name = required_text(request.name.as_deref(), "skill name", MAX_NAME_LEN)?;
    Ok(CreateAdminSkillCommand {
        subject,
        skill_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        skill_key,
        name,
        summary: optional_text(request.summary.as_deref(), "skill summary", MAX_SUMMARY_LEN)?,
        description: optional_text(
            request.description.as_deref(),
            "skill description",
            MAX_DESCRIPTION_LEN,
        )?,
        icon: optional_url_or_path(request.icon.as_deref(), "skill icon", MAX_ICON_LEN)?,
        cover_image: optional_url_or_path(
            request.cover_image.as_deref(),
            "skill coverImage",
            MAX_ICON_LEN,
        )?,
        category_id: normalize_optional_id_value(request.category_id.as_ref(), "categoryId")?,
        package_id: normalize_optional_id_value(request.package_id.as_ref(), "packageId")?,
        provider: optional_text(
            request.provider.as_deref(),
            "skill provider",
            MAX_PROVIDER_LEN,
        )?,
        version: optional_text(request.version.as_deref(), "skill version", MAX_VERSION_LEN)?,
        version_name: optional_text(
            request.version_name.as_deref(),
            "skill versionName",
            MAX_VERSION_LEN,
        )?,
        runtime: optional_text(request.runtime.as_deref(), "skill runtime", MAX_RUNTIME_LEN)?,
        entrypoint: optional_text(
            request.entrypoint.as_deref(),
            "skill entrypoint",
            MAX_ENTRYPOINT_LEN,
        )?,
        manifest_url: optional_url_or_path(
            request.manifest_url.as_deref(),
            "skill manifestUrl",
            MAX_URL_LEN,
        )?,
        repository_url: optional_url_or_path(
            request.repository_url.as_deref(),
            "skill repositoryUrl",
            MAX_URL_LEN,
        )?,
        homepage_url: optional_url_or_path(
            request.homepage_url.as_deref(),
            "skill homepageUrl",
            MAX_URL_LEN,
        )?,
        documentation_url: optional_url_or_path(
            request.documentation_url.as_deref(),
            "skill documentationUrl",
            MAX_URL_LEN,
        )?,
        license_name: optional_text(
            request.license_name.as_deref(),
            "skill licenseName",
            MAX_LICENSE_LEN,
        )?,
        source_type: request
            .source_type
            .as_deref()
            .map(normalize_source_type)
            .transpose()?
            .unwrap_or_else(|| "COMMUNITY".to_owned()),
        market_status: request
            .market_status
            .as_deref()
            .map(normalize_market_status)
            .transpose()?
            .unwrap_or_else(|| "DRAFT".to_owned()),
        visibility: request
            .visibility
            .as_deref()
            .map(normalize_visibility)
            .transpose()?
            .unwrap_or_else(|| "PUBLIC".to_owned()),
        review_status: request
            .review_status
            .as_deref()
            .map(normalize_review_status)
            .transpose()?
            .unwrap_or_else(|| "PENDING".to_owned()),
        builtin: request.builtin.unwrap_or(false),
        is_builtin: request.is_builtin.unwrap_or(false),
        enabled: request.enabled.unwrap_or(true),
        featured: request.featured.unwrap_or(false),
        recommend_weight: request.recommend_weight.unwrap_or(0),
        price: normalize_optional_decimal(request.price.as_ref(), "price")?,
        currency: normalize_currency(request.currency.as_deref())?,
        tags: normalize_string_array(request.tags, "tags")?,
        capabilities: normalize_string_array(request.capabilities, "capabilities")?,
        config_schema: normalize_object(request.config_schema, "configSchema")?,
        default_config: normalize_object(request.default_config, "defaultConfig")?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_skill_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    skill_id: i64,
    request: UpdateSkillRequest,
) -> Result<UpdateAdminSkillCommand, AdminSkillCommandBuildError> {
    let command = UpdateAdminSkillCommand {
        subject,
        skill_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        skill_key: request
            .skill_key
            .as_deref()
            .map(|value| normalize_required_code(Some(value), "skillKey", MAX_KEY_LEN))
            .transpose()?,
        name: request
            .name
            .as_deref()
            .map(|value| required_text(Some(value), "skill name", MAX_NAME_LEN))
            .transpose()?,
        summary: request
            .summary
            .as_deref()
            .map(|value| required_text(Some(value), "skill summary", MAX_SUMMARY_LEN))
            .transpose()?,
        description: normalize_nullable_text(
            request.description.as_ref(),
            "skill description",
            MAX_DESCRIPTION_LEN,
        )?,
        icon: normalize_nullable_url_or_path(request.icon.as_ref(), "skill icon", MAX_ICON_LEN)?,
        cover_image: normalize_nullable_url_or_path(
            request.cover_image.as_ref(),
            "skill coverImage",
            MAX_ICON_LEN,
        )?,
        category_id: normalize_nullable_id_value(request.category_id.as_ref(), "categoryId")?,
        package_id: normalize_nullable_id_value(request.package_id.as_ref(), "packageId")?,
        provider: normalize_nullable_text(
            request.provider.as_ref(),
            "skill provider",
            MAX_PROVIDER_LEN,
        )?,
        version: request
            .version
            .as_deref()
            .map(|value| required_text(Some(value), "skill version", MAX_VERSION_LEN))
            .transpose()?,
        version_name: normalize_nullable_text(
            request.version_name.as_ref(),
            "skill versionName",
            MAX_VERSION_LEN,
        )?,
        runtime: normalize_nullable_text(
            request.runtime.as_ref(),
            "skill runtime",
            MAX_RUNTIME_LEN,
        )?,
        entrypoint: normalize_nullable_text(
            request.entrypoint.as_ref(),
            "skill entrypoint",
            MAX_ENTRYPOINT_LEN,
        )?,
        manifest_url: normalize_nullable_url_or_path(
            request.manifest_url.as_ref(),
            "skill manifestUrl",
            MAX_URL_LEN,
        )?,
        repository_url: normalize_nullable_url_or_path(
            request.repository_url.as_ref(),
            "skill repositoryUrl",
            MAX_URL_LEN,
        )?,
        homepage_url: normalize_nullable_url_or_path(
            request.homepage_url.as_ref(),
            "skill homepageUrl",
            MAX_URL_LEN,
        )?,
        documentation_url: normalize_nullable_url_or_path(
            request.documentation_url.as_ref(),
            "skill documentationUrl",
            MAX_URL_LEN,
        )?,
        license_name: normalize_nullable_text(
            request.license_name.as_ref(),
            "skill licenseName",
            MAX_LICENSE_LEN,
        )?,
        source_type: request
            .source_type
            .as_deref()
            .map(normalize_source_type)
            .transpose()?,
        visibility: request
            .visibility
            .as_deref()
            .map(normalize_visibility)
            .transpose()?,
        builtin: request.builtin,
        is_builtin: request.is_builtin,
        featured: request.featured,
        recommend_weight: request.recommend_weight,
        price: normalize_nullable_decimal(request.price.as_ref(), "price")?,
        currency: request
            .currency
            .as_deref()
            .map(|value| normalize_currency(Some(value)))
            .transpose()?,
        tags: request
            .tags
            .map(|values| normalize_string_array(Some(values), "tags"))
            .transpose()?,
        capabilities: request
            .capabilities
            .map(|values| normalize_string_array(Some(values), "capabilities"))
            .transpose()?,
        config_schema: request
            .config_schema
            .map(|value| normalize_object(Some(value), "configSchema"))
            .transpose()?,
        default_config: request
            .default_config
            .map(|value| normalize_object(Some(value), "defaultConfig"))
            .transpose()?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    };

    if command.skill_key.is_none()
        && command.name.is_none()
        && command.summary.is_none()
        && command.description.is_none()
        && command.icon.is_none()
        && command.cover_image.is_none()
        && command.category_id.is_none()
        && command.package_id.is_none()
        && command.provider.is_none()
        && command.version.is_none()
        && command.version_name.is_none()
        && command.runtime.is_none()
        && command.entrypoint.is_none()
        && command.manifest_url.is_none()
        && command.repository_url.is_none()
        && command.homepage_url.is_none()
        && command.documentation_url.is_none()
        && command.license_name.is_none()
        && command.source_type.is_none()
        && command.visibility.is_none()
        && command.builtin.is_none()
        && command.is_builtin.is_none()
        && command.featured.is_none()
        && command.recommend_weight.is_none()
        && command.price.is_none()
        && command.currency.is_none()
        && command.tags.is_none()
        && command.capabilities.is_none()
        && command.config_schema.is_none()
        && command.default_config.is_none()
    {
        return Err(AdminSkillCommandBuildError::BadRequest(
            "skill update must include at least one editable field".to_owned(),
        ));
    }
    Ok(command)
}

fn build_set_enabled_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    skill_id: i64,
    enabled: bool,
) -> Result<SetAdminSkillEnabledCommand, AdminSkillCommandBuildError> {
    Ok(SetAdminSkillEnabledCommand {
        subject,
        skill_id,
        enabled,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_set_market_status_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    skill_id: i64,
    market_status: &str,
    publish: bool,
) -> Result<SetAdminSkillMarketStatusCommand, AdminSkillCommandBuildError> {
    Ok(SetAdminSkillMarketStatusCommand {
        subject,
        skill_id,
        market_status: market_status.to_owned(),
        publish,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_review_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    skill_id: i64,
    review_status: &str,
    request: ReviewSkillRequest,
) -> Result<ReviewAdminSkillCommand, AdminSkillCommandBuildError> {
    let review_comment = request.review_comment.or(request.comment);
    let review_comment = optional_text(
        review_comment.as_deref(),
        "review comment",
        MAX_REVIEW_COMMENT_LEN,
    )?;
    Ok(ReviewAdminSkillCommand {
        subject,
        skill_id,
        review_status: review_status.to_owned(),
        review_comment,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_delete_skill_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    skill_id: i64,
) -> Result<DeleteAdminSkillCommand, AdminSkillCommandBuildError> {
    Ok(DeleteAdminSkillCommand {
        subject,
        skill_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_create_asset_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    skill_id: i64,
    request: CreateSkillAssetRequest,
) -> Result<CreateAdminSkillAssetCommand, AdminSkillCommandBuildError> {
    Ok(CreateAdminSkillAssetCommand {
        subject,
        skill_id,
        asset_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        artifact_id: normalize_optional_id_value(request.artifact_id.as_ref(), "artifactId")?,
        asset_type: normalize_optional_non_negative_i32(request.asset_type, "assetType")?
            .unwrap_or(1),
        asset_url: required_resource_ref(request.asset_url.as_deref(), "assetUrl")?,
        thumbnail_url: optional_resource_ref(request.thumbnail_url.as_deref(), "thumbnailUrl")?,
        title: optional_text(request.title.as_deref(), "asset title", MAX_NAME_LEN)?,
        alt_text: optional_text(
            request.alt_text.as_deref(),
            "asset altText",
            MAX_SUMMARY_LEN,
        )?,
        mime_type: optional_text(
            request.mime_type.as_deref(),
            "asset mimeType",
            MAX_MIME_TYPE_LEN,
        )?,
        width: normalize_optional_non_negative_i32(request.width, "width")?,
        height: normalize_optional_non_negative_i32(request.height, "height")?,
        duration_seconds: optional_text(
            request.duration_seconds.as_deref(),
            "durationSeconds",
            MAX_VERSION_LEN,
        )?,
        file_size: normalize_optional_non_negative_i64(request.file_size, "fileSize")?,
        sort_order: normalize_optional_non_negative_i32(request.sort_order, "sortOrder")?
            .unwrap_or(0),
        status: normalize_optional_non_negative_i32(request.status, "status")?.unwrap_or(1),
        published_at: optional_text(
            request.published_at.as_deref(),
            "publishedAt",
            MAX_VERSION_LEN,
        )?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_asset_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    skill_id: i64,
    asset_id: i64,
    request: UpdateSkillAssetRequest,
) -> Result<UpdateAdminSkillAssetCommand, AdminSkillCommandBuildError> {
    let command = UpdateAdminSkillAssetCommand {
        subject,
        skill_id,
        asset_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        artifact_id: normalize_nullable_id_value(request.artifact_id.as_ref(), "artifactId")?,
        asset_type: normalize_optional_non_negative_i32(request.asset_type, "assetType")?,
        asset_url: request
            .asset_url
            .as_deref()
            .map(|value| required_resource_ref(Some(value), "assetUrl"))
            .transpose()?,
        thumbnail_url: normalize_nullable_resource_ref(
            request.thumbnail_url.as_ref(),
            "thumbnailUrl",
        )?,
        title: normalize_nullable_text(request.title.as_ref(), "asset title", MAX_NAME_LEN)?,
        alt_text: normalize_nullable_text(
            request.alt_text.as_ref(),
            "asset altText",
            MAX_SUMMARY_LEN,
        )?,
        mime_type: normalize_nullable_text(
            request.mime_type.as_ref(),
            "asset mimeType",
            MAX_MIME_TYPE_LEN,
        )?,
        width: normalize_nullable_non_negative_i32(request.width.as_ref(), "width")?,
        height: normalize_nullable_non_negative_i32(request.height.as_ref(), "height")?,
        duration_seconds: normalize_nullable_text(
            request.duration_seconds.as_ref(),
            "durationSeconds",
            MAX_VERSION_LEN,
        )?,
        file_size: normalize_nullable_non_negative_i64(request.file_size.as_ref(), "fileSize")?,
        sort_order: normalize_optional_non_negative_i32(request.sort_order, "sortOrder")?,
        status: normalize_optional_non_negative_i32(request.status, "status")?,
        published_at: normalize_nullable_text(
            request.published_at.as_ref(),
            "publishedAt",
            MAX_VERSION_LEN,
        )?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    };
    if command.artifact_id.is_none()
        && command.asset_type.is_none()
        && command.asset_url.is_none()
        && command.thumbnail_url.is_none()
        && command.title.is_none()
        && command.alt_text.is_none()
        && command.mime_type.is_none()
        && command.width.is_none()
        && command.height.is_none()
        && command.duration_seconds.is_none()
        && command.file_size.is_none()
        && command.sort_order.is_none()
        && command.status.is_none()
        && command.published_at.is_none()
    {
        return Err(AdminSkillCommandBuildError::BadRequest(
            "skill asset update must include at least one editable field".to_owned(),
        ));
    }
    Ok(command)
}

fn build_delete_asset_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    skill_id: i64,
    asset_id: i64,
) -> Result<DeleteAdminSkillAssetCommand, AdminSkillCommandBuildError> {
    Ok(DeleteAdminSkillAssetCommand {
        subject,
        skill_id,
        asset_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_create_artifact_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    skill_id: i64,
    request: CreateSkillArtifactRequest,
) -> Result<CreateAdminSkillArtifactCommand, AdminSkillCommandBuildError> {
    let artifact_ref = optional_resource_ref(request.artifact_ref.as_deref(), "artifactRef")?;
    let artifact_url = optional_resource_ref(request.artifact_url.as_deref(), "artifactUrl")?;
    if artifact_ref.is_none() && artifact_url.is_none() {
        return Err(AdminSkillCommandBuildError::BadRequest(
            "artifactRef or artifactUrl is required".to_owned(),
        ));
    }
    Ok(CreateAdminSkillArtifactCommand {
        subject,
        skill_id,
        artifact_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        artifact_type: normalize_optional_non_negative_i32(request.artifact_type, "artifactType")?
            .unwrap_or(1),
        version: required_text(
            request.version.as_deref().or(Some("1.0.0")),
            "artifact version",
            MAX_VERSION_LEN,
        )?,
        platform_type: required_text(
            request.platform_type.as_deref().or(Some("agent")),
            "platformType",
            MAX_KEY_LEN,
        )?,
        os_name: required_text(
            request.os_name.as_deref().or(Some("runtime")),
            "osName",
            MAX_KEY_LEN,
        )?,
        artifact_ref,
        artifact_url,
        artifact_size_bytes: normalize_optional_non_negative_i64(
            request.artifact_size_bytes,
            "artifactSizeBytes",
        )?
        .unwrap_or(0),
        runtime: optional_text(
            request.runtime.as_deref(),
            "artifact runtime",
            MAX_RUNTIME_LEN,
        )?,
        frameworks: normalize_label_array(request.frameworks, "frameworks")?,
        license_name: optional_text(
            request.license_name.as_deref(),
            "licenseName",
            MAX_LICENSE_LEN,
        )?,
        checksum_hash: normalize_optional_checksum_hash(request.checksum_hash.as_deref())?,
        release_notes: optional_text(
            request.release_notes.as_deref(),
            "releaseNotes",
            MAX_RELEASE_NOTES_LEN,
        )?,
        status: normalize_optional_non_negative_i32(request.status, "status")?.unwrap_or(1),
        published_at: optional_text(
            request.published_at.as_deref(),
            "publishedAt",
            MAX_VERSION_LEN,
        )?,
        deprecated_at: optional_text(
            request.deprecated_at.as_deref(),
            "deprecatedAt",
            MAX_VERSION_LEN,
        )?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_artifact_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    skill_id: i64,
    artifact_id: i64,
    request: UpdateSkillArtifactRequest,
) -> Result<UpdateAdminSkillArtifactCommand, AdminSkillCommandBuildError> {
    let command = UpdateAdminSkillArtifactCommand {
        subject,
        skill_id,
        artifact_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        artifact_type: normalize_optional_non_negative_i32(request.artifact_type, "artifactType")?,
        version: request
            .version
            .as_deref()
            .map(|value| required_text(Some(value), "artifact version", MAX_VERSION_LEN))
            .transpose()?,
        platform_type: request
            .platform_type
            .as_deref()
            .map(|value| required_text(Some(value), "platformType", MAX_KEY_LEN))
            .transpose()?,
        os_name: request
            .os_name
            .as_deref()
            .map(|value| required_text(Some(value), "osName", MAX_KEY_LEN))
            .transpose()?,
        artifact_ref: normalize_nullable_resource_ref(
            request.artifact_ref.as_ref(),
            "artifactRef",
        )?,
        artifact_url: normalize_nullable_resource_ref(
            request.artifact_url.as_ref(),
            "artifactUrl",
        )?,
        artifact_size_bytes: normalize_optional_non_negative_i64(
            request.artifact_size_bytes,
            "artifactSizeBytes",
        )?,
        runtime: normalize_nullable_text(
            request.runtime.as_ref(),
            "artifact runtime",
            MAX_RUNTIME_LEN,
        )?,
        frameworks: request
            .frameworks
            .map(|values| normalize_label_array(Some(values), "frameworks"))
            .transpose()?,
        license_name: normalize_nullable_text(
            request.license_name.as_ref(),
            "licenseName",
            MAX_LICENSE_LEN,
        )?,
        checksum_hash: normalize_nullable_checksum_hash(request.checksum_hash.as_ref())?,
        release_notes: normalize_nullable_text(
            request.release_notes.as_ref(),
            "releaseNotes",
            MAX_RELEASE_NOTES_LEN,
        )?,
        status: normalize_optional_non_negative_i32(request.status, "status")?,
        published_at: normalize_nullable_text(
            request.published_at.as_ref(),
            "publishedAt",
            MAX_VERSION_LEN,
        )?,
        deprecated_at: normalize_nullable_text(
            request.deprecated_at.as_ref(),
            "deprecatedAt",
            MAX_VERSION_LEN,
        )?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    };
    if command.artifact_type.is_none()
        && command.version.is_none()
        && command.platform_type.is_none()
        && command.os_name.is_none()
        && command.artifact_ref.is_none()
        && command.artifact_url.is_none()
        && command.artifact_size_bytes.is_none()
        && command.runtime.is_none()
        && command.frameworks.is_none()
        && command.license_name.is_none()
        && command.checksum_hash.is_none()
        && command.release_notes.is_none()
        && command.status.is_none()
        && command.published_at.is_none()
        && command.deprecated_at.is_none()
    {
        return Err(AdminSkillCommandBuildError::BadRequest(
            "skill artifact update must include at least one editable field".to_owned(),
        ));
    }
    Ok(command)
}

fn build_delete_artifact_command(
    state: AdminSkillState,
    headers: &HeaderMap,
    subject: AdminSkillSubject,
    skill_id: i64,
    artifact_id: i64,
) -> Result<DeleteAdminSkillArtifactCommand, AdminSkillCommandBuildError> {
    Ok(DeleteAdminSkillArtifactCommand {
        subject,
        skill_id,
        artifact_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn required_text(
    value: Option<&str>,
    field_name: &str,
    max_len: usize,
) -> Result<String, AdminSkillCommandBuildError> {
    let value = optional_text(value, field_name, max_len)?.ok_or_else(|| {
        AdminSkillCommandBuildError::BadRequest(format!("{field_name} is required"))
    })?;
    Ok(value)
}

fn optional_text(
    value: Option<&str>,
    field_name: &str,
    max_len: usize,
) -> Result<Option<String>, AdminSkillCommandBuildError> {
    let Some(value) = value else {
        return Ok(None);
    };
    let value = value.trim();
    if value.is_empty() {
        return Ok(None);
    }
    if value.chars().count() > max_len {
        return Err(AdminSkillCommandBuildError::BadRequest(format!(
            "{field_name} must be at most {max_len} characters"
        )));
    }
    if value.chars().any(char::is_control) {
        return Err(AdminSkillCommandBuildError::BadRequest(format!(
            "{field_name} must not contain control characters"
        )));
    }
    Ok(Some(value.to_owned()))
}

fn normalize_optional_text(value: Option<&str>, max_len: usize) -> Option<String> {
    value
        .map(str::trim)
        .filter(|value| !value.is_empty() && value.chars().count() <= max_len)
        .map(str::to_owned)
}

fn normalize_nullable_text(
    value: Option<&Value>,
    field_name: &str,
    max_len: usize,
) -> Result<Option<Option<String>>, AdminSkillCommandBuildError> {
    let Some(value) = value else {
        return Ok(None);
    };
    match value {
        Value::Null => Ok(Some(None)),
        Value::String(value) => Ok(Some(optional_text(Some(value), field_name, max_len)?)),
        _ => Err(AdminSkillCommandBuildError::BadRequest(format!(
            "{field_name} must be a string or null"
        ))),
    }
}

fn normalize_required_code(
    value: Option<&str>,
    field_name: &str,
    max_len: usize,
) -> Result<String, AdminSkillCommandBuildError> {
    let value = required_text(value, field_name, max_len)?;
    validate_code(&value, field_name)?;
    Ok(value)
}

fn normalize_optional_code(
    value: Option<&str>,
    field_name: &str,
    max_len: usize,
) -> Result<Option<String>, AdminSkillCommandBuildError> {
    let value = optional_text(value, field_name, max_len)?;
    if let Some(value) = value.as_deref() {
        validate_code(value, field_name)?;
    }
    Ok(value)
}

fn validate_code(value: &str, field_name: &str) -> Result<(), AdminSkillCommandBuildError> {
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_'))
    {
        return Err(AdminSkillCommandBuildError::BadRequest(format!(
            "{field_name} must use ASCII letters, numbers, hyphen, or underscore"
        )));
    }
    Ok(())
}

fn normalize_path(value: &str, field_name: &str) -> Result<String, AdminSkillCommandBuildError> {
    let value = required_text(Some(value), field_name, 1024)?;
    if !value.starts_with('/') {
        return Err(AdminSkillCommandBuildError::BadRequest(format!(
            "{field_name} must start with /"
        )));
    }
    Ok(value)
}

fn optional_url_or_path(
    value: Option<&str>,
    field_name: &str,
    max_len: usize,
) -> Result<Option<String>, AdminSkillCommandBuildError> {
    let value = optional_text(value, field_name, max_len)?;
    if let Some(value) = value.as_deref() {
        validate_url_or_path(value, field_name)?;
    }
    Ok(value)
}

fn normalize_nullable_url_or_path(
    value: Option<&Value>,
    field_name: &str,
    max_len: usize,
) -> Result<Option<Option<String>>, AdminSkillCommandBuildError> {
    let value = normalize_nullable_text(value, field_name, max_len)?;
    if let Some(Some(value)) = value.as_ref() {
        validate_url_or_path(value, field_name)?;
    }
    Ok(value)
}

fn validate_url_or_path(value: &str, field_name: &str) -> Result<(), AdminSkillCommandBuildError> {
    if value.starts_with("http://")
        || value.starts_with("https://")
        || value.starts_with("artifact://")
        || value.starts_with('/')
    {
        return Ok(());
    }
    Err(AdminSkillCommandBuildError::BadRequest(format!(
        "{field_name} must be an http(s), artifact, or absolute path reference"
    )))
}

fn required_resource_ref(
    value: Option<&str>,
    field_name: &str,
) -> Result<String, AdminSkillCommandBuildError> {
    let value = required_text(value, field_name, MAX_RESOURCE_REF_LEN)?;
    validate_resource_ref(&value, field_name)?;
    Ok(value)
}

fn optional_resource_ref(
    value: Option<&str>,
    field_name: &str,
) -> Result<Option<String>, AdminSkillCommandBuildError> {
    let value = optional_text(value, field_name, MAX_RESOURCE_REF_LEN)?;
    if let Some(value) = value.as_deref() {
        validate_resource_ref(value, field_name)?;
    }
    Ok(value)
}

fn normalize_nullable_resource_ref(
    value: Option<&Value>,
    field_name: &str,
) -> Result<Option<Option<String>>, AdminSkillCommandBuildError> {
    let value = normalize_nullable_text(value, field_name, MAX_RESOURCE_REF_LEN)?;
    if let Some(Some(value)) = value.as_ref() {
        validate_resource_ref(value, field_name)?;
    }
    Ok(value)
}

fn validate_resource_ref(value: &str, field_name: &str) -> Result<(), AdminSkillCommandBuildError> {
    if value.starts_with("http://")
        || value.starts_with("https://")
        || value.starts_with("artifact://")
        || value.starts_with("builtin://")
        || value.starts_with("data/skills/")
        || value.starts_with('/')
    {
        return Ok(());
    }
    Err(AdminSkillCommandBuildError::BadRequest(format!(
        "{field_name} must be an http(s), builtin, artifact, data/skills, or absolute path reference"
    )))
}

fn normalize_optional_id_value(value: Option<&Value>, field: &str) -> Result<Option<i64>, String> {
    match value {
        None | Some(Value::Null) => Ok(None),
        Some(Value::Number(value)) => value
            .as_i64()
            .filter(|value| *value > 0)
            .ok_or_else(|| format!("{field} must be a positive integer"))
            .map(Some),
        Some(Value::String(value)) => {
            let value = value.trim();
            if value.is_empty() {
                return Ok(None);
            }
            parse_positive_id(value, field).map(Some)
        }
        _ => Err(format!("{field} must be a positive integer")),
    }
}

fn normalize_nullable_id_value(
    value: Option<&Value>,
    field: &str,
) -> Result<Option<Option<i64>>, AdminSkillCommandBuildError> {
    let Some(value) = value else {
        return Ok(None);
    };
    normalize_optional_id_value(Some(value), field)
        .map(Some)
        .map_err(AdminSkillCommandBuildError::BadRequest)
}

fn normalize_optional_non_negative_i32(
    value: Option<i32>,
    field: &str,
) -> Result<Option<i32>, AdminSkillCommandBuildError> {
    match value {
        Some(value) if value < 0 => Err(AdminSkillCommandBuildError::BadRequest(format!(
            "{field} must be a non-negative integer"
        ))),
        value => Ok(value),
    }
}

fn normalize_optional_non_negative_i64(
    value: Option<i64>,
    field: &str,
) -> Result<Option<i64>, AdminSkillCommandBuildError> {
    match value {
        Some(value) if value < 0 => Err(AdminSkillCommandBuildError::BadRequest(format!(
            "{field} must be a non-negative integer"
        ))),
        value => Ok(value),
    }
}

fn normalize_nullable_non_negative_i32(
    value: Option<&Value>,
    field: &str,
) -> Result<Option<Option<i32>>, AdminSkillCommandBuildError> {
    let Some(value) = value else {
        return Ok(None);
    };
    match value {
        Value::Null => Ok(Some(None)),
        Value::Number(value) => {
            let value = value.as_i64().ok_or_else(|| {
                AdminSkillCommandBuildError::BadRequest(format!(
                    "{field} must be a non-negative integer"
                ))
            })?;
            if value < 0 || value > i32::MAX as i64 {
                return Err(AdminSkillCommandBuildError::BadRequest(format!(
                    "{field} must be a non-negative integer"
                )));
            }
            Ok(Some(Some(value as i32)))
        }
        Value::String(value) => {
            let value = value.trim();
            if value.is_empty() {
                return Ok(Some(None));
            }
            let value = value.parse::<i32>().map_err(|_| {
                AdminSkillCommandBuildError::BadRequest(format!(
                    "{field} must be a non-negative integer"
                ))
            })?;
            normalize_optional_non_negative_i32(Some(value), field).map(Some)
        }
        _ => Err(AdminSkillCommandBuildError::BadRequest(format!(
            "{field} must be a non-negative integer or null"
        ))),
    }
}

fn normalize_nullable_non_negative_i64(
    value: Option<&Value>,
    field: &str,
) -> Result<Option<Option<i64>>, AdminSkillCommandBuildError> {
    let Some(value) = value else {
        return Ok(None);
    };
    match value {
        Value::Null => Ok(Some(None)),
        Value::Number(value) => {
            let value = value.as_i64().ok_or_else(|| {
                AdminSkillCommandBuildError::BadRequest(format!(
                    "{field} must be a non-negative integer"
                ))
            })?;
            normalize_optional_non_negative_i64(Some(value), field).map(Some)
        }
        Value::String(value) => {
            let value = value.trim();
            if value.is_empty() {
                return Ok(Some(None));
            }
            let value = value.parse::<i64>().map_err(|_| {
                AdminSkillCommandBuildError::BadRequest(format!(
                    "{field} must be a non-negative integer"
                ))
            })?;
            normalize_optional_non_negative_i64(Some(value), field).map(Some)
        }
        _ => Err(AdminSkillCommandBuildError::BadRequest(format!(
            "{field} must be a non-negative integer or null"
        ))),
    }
}

fn normalize_source_type(value: &str) -> Result<String, String> {
    normalize_enum(
        value,
        "sourceType",
        &["OFFICIAL", "COMMUNITY", "ENTERPRISE", "PRIVATE", "CUSTOM"],
    )
}

fn normalize_market_status(value: &str) -> Result<String, String> {
    normalize_enum(
        value,
        "marketStatus",
        &["DRAFT", "PUBLISHED", "OFFLINE", "DEPRECATED"],
    )
}

fn normalize_visibility(value: &str) -> Result<String, String> {
    normalize_enum(value, "visibility", &["PUBLIC", "PRIVATE", "UNLISTED"])
}

fn normalize_review_status(value: &str) -> Result<String, String> {
    normalize_enum(value, "reviewStatus", &["PENDING", "APPROVED", "REJECTED"])
}

fn normalize_enum(value: &str, field: &str, allowed: &[&str]) -> Result<String, String> {
    let value = value.trim().to_ascii_uppercase();
    if allowed.iter().any(|allowed| *allowed == value) {
        Ok(value)
    } else {
        Err(format!("{field} must be one of {}", allowed.join(", ")))
    }
}

fn normalize_string_array(
    values: Option<Vec<String>>,
    field_name: &str,
) -> Result<Vec<String>, AdminSkillCommandBuildError> {
    let Some(values) = values else {
        return Ok(Vec::new());
    };
    if values.len() > MAX_ARRAY_ITEMS {
        return Err(AdminSkillCommandBuildError::BadRequest(format!(
            "{field_name} must contain at most {MAX_ARRAY_ITEMS} items"
        )));
    }
    let mut normalized = Vec::new();
    for value in values {
        let Some(value) = optional_text(Some(&value), field_name, MAX_ARRAY_ITEM_LEN)? else {
            continue;
        };
        if !value
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b'.' | b':'))
        {
            return Err(AdminSkillCommandBuildError::BadRequest(format!(
                "{field_name} items contain unsupported characters"
            )));
        }
        if !normalized.contains(&value) {
            normalized.push(value);
        }
    }
    Ok(normalized)
}

fn normalize_label_array(
    values: Option<Vec<String>>,
    field_name: &str,
) -> Result<Vec<String>, AdminSkillCommandBuildError> {
    let Some(values) = values else {
        return Ok(Vec::new());
    };
    if values.len() > MAX_ARRAY_ITEMS {
        return Err(AdminSkillCommandBuildError::BadRequest(format!(
            "{field_name} must contain at most {MAX_ARRAY_ITEMS} items"
        )));
    }
    let mut normalized = Vec::new();
    for value in values {
        let Some(value) = optional_text(Some(&value), field_name, MAX_ARRAY_ITEM_LEN)? else {
            continue;
        };
        if !normalized.contains(&value) {
            normalized.push(value);
        }
    }
    Ok(normalized)
}

fn normalize_object(
    value: Option<Value>,
    field_name: &str,
) -> Result<Value, AdminSkillCommandBuildError> {
    let value = value.unwrap_or_else(|| serde_json::json!({}));
    if !value.is_object() {
        return Err(AdminSkillCommandBuildError::BadRequest(format!(
            "{field_name} must be a JSON object"
        )));
    }
    Ok(value)
}

fn normalize_optional_checksum_hash(
    value: Option<&str>,
) -> Result<Option<String>, AdminSkillCommandBuildError> {
    let value = optional_text(value, "checksumHash", 128)?;
    if let Some(value) = value.as_deref() {
        validate_checksum_hash(value)?;
    }
    Ok(value)
}

fn normalize_nullable_checksum_hash(
    value: Option<&Value>,
) -> Result<Option<Option<String>>, AdminSkillCommandBuildError> {
    let value = normalize_nullable_text(value, "checksumHash", 128)?;
    if let Some(Some(value)) = value.as_ref() {
        validate_checksum_hash(value)?;
    }
    Ok(value)
}

fn validate_checksum_hash(value: &str) -> Result<(), AdminSkillCommandBuildError> {
    let Some(hash) = value.strip_prefix("sha256:") else {
        return Err(AdminSkillCommandBuildError::BadRequest(
            "checksumHash must use sha256:<64 lowercase hex>".to_owned(),
        ));
    };
    if hash.len() != 64
        || !hash
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
    {
        return Err(AdminSkillCommandBuildError::BadRequest(
            "checksumHash must use sha256:<64 lowercase hex>".to_owned(),
        ));
    }
    Ok(())
}

fn normalize_optional_decimal(
    value: Option<&Value>,
    field: &str,
) -> Result<Option<String>, String> {
    match value {
        None | Some(Value::Null) => Ok(None),
        Some(Value::Number(value)) => normalize_decimal_string(&value.to_string(), field).map(Some),
        Some(Value::String(value)) => {
            let value = value.trim();
            if value.is_empty() {
                Ok(None)
            } else {
                normalize_decimal_string(value, field).map(Some)
            }
        }
        _ => Err(format!("{field} must be a positive decimal amount")),
    }
}

fn normalize_nullable_decimal(
    value: Option<&Value>,
    field: &str,
) -> Result<Option<Option<String>>, AdminSkillCommandBuildError> {
    let Some(value) = value else {
        return Ok(None);
    };
    normalize_optional_decimal(Some(value), field)
        .map(Some)
        .map_err(AdminSkillCommandBuildError::BadRequest)
}

fn normalize_decimal_string(value: &str, field: &str) -> Result<String, String> {
    let value = value.trim().trim_start_matches('$').replace(',', "");
    if value.starts_with('-')
        || value.starts_with('+')
        || value.contains('e')
        || value.contains('E')
    {
        return Err(format!("{field} must be a positive decimal amount"));
    }
    let parts = value.split('.').collect::<Vec<_>>();
    if parts.is_empty()
        || parts.len() > 2
        || parts[0].is_empty()
        || !parts[0].chars().all(|ch| ch.is_ascii_digit())
        || parts[0].len() > 24
        || parts
            .get(1)
            .map(|part| part.len() > 12 || !part.chars().all(|ch| ch.is_ascii_digit()))
            .unwrap_or(false)
    {
        return Err(format!(
            "{field} must be a valid decimal amount with at most 12 decimal places"
        ));
    }
    let whole = parts[0].trim_start_matches('0');
    let whole = if whole.is_empty() { "0" } else { whole };
    let fraction = parts.get(1).copied().unwrap_or("").trim_end_matches('0');
    if fraction.is_empty() {
        Ok(whole.to_owned())
    } else {
        Ok(format!("{whole}.{fraction}"))
    }
}

fn normalize_currency(value: Option<&str>) -> Result<String, AdminSkillCommandBuildError> {
    let value = optional_text(value, "currency", 16)?.unwrap_or_else(|| "CNY".to_owned());
    if !value.bytes().all(|byte| byte.is_ascii_uppercase()) {
        return Err(AdminSkillCommandBuildError::BadRequest(
            "currency must be an uppercase ISO-style code".to_owned(),
        ));
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

fn generate_entity_uuid(state: &AdminSkillState) -> Result<String, AdminSkillCommandBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(AdminSkillCommandBuildError::System)
}

fn normalize_request_id(
    headers: &HeaderMap,
    state: &AdminSkillState,
) -> Result<String, AdminSkillCommandBuildError> {
    if let Some(value) = header_value(headers, REQUEST_ID_HEADER) {
        if value.chars().count() > MAX_REQUEST_ID_LEN
            || !value.bytes().all(|byte| (0x21..=0x7e).contains(&byte))
        {
            return Err(AdminSkillCommandBuildError::BadRequest(format!(
                "{REQUEST_ID_HEADER} must be visible ASCII and at most {MAX_REQUEST_ID_LEN} characters"
            )));
        }
        return Ok(value.to_owned());
    }
    generate_entity_uuid(state)
}

fn header_value<'a>(headers: &'a HeaderMap, name: &str) -> Option<&'a str> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| !value.is_empty())
}

fn to_category_response(item: AdminSkillCategoryItem) -> AdminSkillCategoryItemResponse {
    AdminSkillCategoryItemResponse {
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

fn to_package_response(item: AdminSkillPackageItem) -> AdminSkillPackageItemResponse {
    AdminSkillPackageItemResponse {
        id: item.id.to_string(),
        package_key: item.package_key,
        name: item.name,
        summary: item.summary,
        description: item.description,
        icon: item.icon,
        cover_image: item.cover_image,
        category_id: item.category_id.map(|value| value.to_string()),
        enabled: item.enabled,
        featured: item.featured,
        sort_weight: item.sort_weight,
        tags: item.tags,
        latest_published_at: item.latest_published_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
    }
}

fn to_skill_response(item: AdminSkillItem) -> AdminSkillItemResponse {
    AdminSkillItemResponse {
        id: item.id.to_string(),
        skill_key: item.skill_key,
        name: item.name,
        summary: item.summary,
        description: item.description,
        icon: item.icon,
        cover_image: item.cover_image,
        category_id: item.category_id.map(|value| value.to_string()),
        package_id: item.package_id.map(|value| value.to_string()),
        provider: item.provider,
        version: item.version,
        version_name: item.version_name,
        runtime: item.runtime,
        entrypoint: item.entrypoint,
        manifest_url: item.manifest_url,
        repository_url: item.repository_url,
        homepage_url: item.homepage_url,
        documentation_url: item.documentation_url,
        license_name: item.license_name,
        source_type: item.source_type,
        market_status: item.market_status,
        visibility: item.visibility,
        review_status: item.review_status,
        review_comment: item.review_comment,
        reviewed_by: item.reviewed_by.map(|value| value.to_string()),
        reviewed_at: item.reviewed_at,
        builtin: item.builtin,
        is_builtin: item.is_builtin,
        enabled: item.enabled,
        featured: item.featured,
        recommend_weight: item.recommend_weight,
        price: item.price,
        currency: item.currency,
        install_count: item.install_count.to_string(),
        rating_avg: item.rating_avg,
        rating_count: item.rating_count.to_string(),
        tags: item.tags,
        capabilities: item.capabilities,
        config_schema: item.config_schema,
        default_config: item.default_config,
        latest_published_at: item.latest_published_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
    }
}

fn to_asset_response(item: AdminSkillAssetItem) -> AdminSkillAssetItemResponse {
    AdminSkillAssetItemResponse {
        id: item.id.to_string(),
        skill_id: item.target_id.to_string(),
        target_type: item.target_type,
        target_id: item.target_id.to_string(),
        artifact_id: item.artifact_id.map(|value| value.to_string()),
        asset_type: item.asset_type,
        asset_url: item.asset_url,
        thumbnail_url: item.thumbnail_url,
        title: item.title,
        alt_text: item.alt_text,
        mime_type: item.mime_type,
        width: item.width,
        height: item.height,
        duration_seconds: item.duration_seconds,
        file_size: item.file_size,
        sort_order: item.sort_order,
        status: item.status,
        published_at: item.published_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
    }
}

fn to_artifact_response(item: AdminSkillArtifactItem) -> AdminSkillArtifactItemResponse {
    AdminSkillArtifactItemResponse {
        id: item.id.to_string(),
        skill_id: item.target_id.to_string(),
        target_type: item.target_type,
        target_id: item.target_id.to_string(),
        artifact_type: item.artifact_type,
        version: item.version,
        platform_type: item.platform_type,
        os_name: item.os_name,
        artifact_ref: item.artifact_ref,
        artifact_url: item.artifact_url,
        artifact_size_bytes: item.artifact_size_bytes,
        runtime: item.runtime,
        frameworks: item.frameworks,
        license_name: item.license_name,
        checksum_hash: item.checksum_hash,
        release_notes: item.release_notes,
        status: item.status,
        published_at: item.published_at,
        deprecated_at: item.deprecated_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
    }
}

fn package_item_command_response(
    result: Result<Option<AdminSkillPackageItem>, DomainError>,
    not_found_message: &'static str,
) -> Response {
    match result {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
            item: to_package_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response(not_found_message),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => {
            admin_skill_system_response("skill package command store is unavailable", error)
        }
    }
}

fn item_command_response(
    result: Result<Option<AdminSkillItem>, DomainError>,
    not_found_message: &'static str,
) -> Response {
    match result {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
            item: to_skill_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response(not_found_message),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => admin_skill_system_response("skill command store is unavailable", error),
    }
}

fn asset_item_command_response(
    result: Result<Option<AdminSkillAssetItem>, DomainError>,
    not_found_message: &'static str,
) -> Response {
    match result {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
            item: to_asset_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response(not_found_message),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => {
            admin_skill_system_response("skill asset command store is unavailable", error)
        }
    }
}

fn artifact_item_command_response(
    result: Result<Option<AdminSkillArtifactItem>, DomainError>,
    not_found_message: &'static str,
) -> Response {
    match result {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminSkillItemEnvelope {
            item: to_artifact_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response(not_found_message),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) if error.is_not_found() => not_found_response(&error.to_string()),
        Err(error) => {
            admin_skill_system_response("skill artifact command store is unavailable", error)
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

fn not_found_response(message: &str) -> Response {
    (
        StatusCode::NOT_FOUND,
        Json(PlusApiResult::error("4040", message.to_owned())),
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

fn command_build_error_response(error: AdminSkillCommandBuildError) -> Response {
    match error {
        AdminSkillCommandBuildError::BadRequest(message) => bad_request(message),
        AdminSkillCommandBuildError::System(error) => {
            admin_skill_system_response("admin skill command is invalid", error)
        }
    }
}

fn admin_skill_system_response(context: &str, error: impl std::fmt::Display) -> Response {
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

impl From<String> for AdminSkillCommandBuildError {
    fn from(value: String) -> Self {
        Self::BadRequest(value)
    }
}
