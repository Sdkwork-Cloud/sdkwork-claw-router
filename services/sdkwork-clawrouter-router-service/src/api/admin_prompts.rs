use std::sync::Arc;

use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post, put};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::api::response::PlusApiResult;
use crate::domain::DomainError;
use crate::ports::{
    AdminPromptStore, AdminPromptSubject, CreateAdminPromptBindingCommand,
    CreateAdminPromptCommand, CreateAdminPromptVersionCommand, ListAdminPromptBindingsQuery,
    ListAdminPromptVersionsQuery, ListAdminPromptsQuery, PublishAdminPromptVersionCommand,
    RenderAdminPromptVersionCommand, UpdateAdminPromptBindingCommand,
};

const DEFAULT_PAGE_NO: i64 = 1;
const DEFAULT_PAGE_SIZE: i64 = 50;
const MAX_PAGE_SIZE: i64 = 200;
const MAX_KEY_LEN: usize = 128;
const MAX_NAME_LEN: usize = 255;
const MAX_DESCRIPTION_LEN: usize = 2000;
const MAX_ENUM_LEN: usize = 64;
const MAX_TAGS: usize = 32;
const MAX_TAG_LEN: usize = 64;
const MAX_CONTENT_LEN: usize = 50_000;
const MAX_TITLE_LEN: usize = 255;

#[derive(Clone)]
struct AdminPromptState {
    store: Arc<dyn AdminPromptStore + Send + Sync>,
}

#[derive(Debug, Default, Deserialize)]
struct ListPromptsRequest {
    page: Option<i64>,
    page_size: Option<i64>,
    q: Option<String>,
    prompt_type: Option<String>,
    visibility: Option<String>,
    status: Option<String>,
    category_id: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreatePromptRequest {
    prompt_key: String,
    name: String,
    description: Option<String>,
    category_id: Option<String>,
    prompt_type: Option<String>,
    visibility: Option<String>,
    tags: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreatePromptVersionRequest {
    version_no: String,
    title: String,
    content: String,
    variable_schema: Option<Value>,
    output_schema: Option<Value>,
    model_constraints: Option<Value>,
    safety_policy: Option<Value>,
    examples_json: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RenderPromptVersionRequest {
    variables: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreatePromptBindingRequest {
    prompt_version_id: Option<i64>,
    owner_type: String,
    owner_id: i64,
    binding_role: String,
    priority: Option<i32>,
    enabled: Option<bool>,
    policy_json: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdatePromptBindingRequest {
    prompt_version_id: Option<Value>,
    owner_type: Option<String>,
    owner_id: Option<i64>,
    binding_role: Option<String>,
    priority: Option<i32>,
    enabled: Option<bool>,
    policy_json: Option<Value>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminPromptListResponse<T> {
    items: Vec<T>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminPromptItemEnvelope<T> {
    item: T,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminPromptRenderResponse {
    rendered: String,
}

pub fn admin_prompt_router_with_store(store: Arc<dyn AdminPromptStore + Send + Sync>) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/prompts",
            get(list_prompts).post(create_prompt),
        )
        .route(
            "/backend/v3/api/prompts/{prompt_id}/versions",
            get(list_versions).post(create_version),
        )
        .route(
            "/backend/v3/api/prompts/versions/{version_id}/publish",
            post(publish_version),
        )
        .route(
            "/backend/v3/api/prompts/versions/{version_id}/render",
            post(render_version),
        )
        .route(
            "/backend/v3/api/prompts/{prompt_id}/bindings",
            get(list_bindings).post(create_binding),
        )
        .route(
            "/backend/v3/api/prompts/bindings/{binding_id}",
            put(update_binding),
        )
        .with_state(AdminPromptState { store })
}

async fn list_prompts(
    State(state): State<AdminPromptState>,
    trusted: TrustedRequestSubject,
    headers: HeaderMap,
    Query(request): Query<ListPromptsRequest>,
) -> Response {
    let query = match build_list_prompts_query(trusted, &headers, request) {
        Ok(query) => query,
        Err(response) => return response,
    };
    match state.store.list_prompts(query).await {
        Ok(items) => list_response(items),
        Err(error) => prompt_error_response("prompt list is unavailable", error),
    }
}

async fn create_prompt(
    State(state): State<AdminPromptState>,
    trusted: TrustedRequestSubject,
    headers: HeaderMap,
    Json(request): Json<CreatePromptRequest>,
) -> Response {
    let command = match build_create_prompt_command(trusted, &headers, request) {
        Ok(command) => command,
        Err(response) => return response,
    };
    match state.store.create_prompt(command).await {
        Ok(item) => item_response(item),
        Err(error) => prompt_error_response("prompt create is unavailable", error),
    }
}

async fn list_versions(
    State(state): State<AdminPromptState>,
    trusted: TrustedRequestSubject,
    headers: HeaderMap,
    Path(prompt_id): Path<String>,
) -> Response {
    let query = match build_list_versions_query(trusted, &headers, &prompt_id) {
        Ok(query) => query,
        Err(response) => return response,
    };
    match state.store.list_versions(query).await {
        Ok(items) => list_response(items),
        Err(error) => prompt_error_response("prompt version list is unavailable", error),
    }
}

async fn create_version(
    State(state): State<AdminPromptState>,
    trusted: TrustedRequestSubject,
    headers: HeaderMap,
    Path(prompt_id): Path<String>,
    Json(request): Json<CreatePromptVersionRequest>,
) -> Response {
    let command = match build_create_version_command(trusted, &headers, &prompt_id, request) {
        Ok(command) => command,
        Err(response) => return response,
    };
    match state.store.create_version(command).await {
        Ok(item) => item_response(item),
        Err(error) => prompt_error_response("prompt version create is unavailable", error),
    }
}

async fn publish_version(
    State(state): State<AdminPromptState>,
    trusted: TrustedRequestSubject,
    headers: HeaderMap,
    Path(version_id): Path<String>,
) -> Response {
    let command = match build_publish_version_command(trusted, &headers, &version_id) {
        Ok(command) => command,
        Err(response) => return response,
    };
    match state.store.publish_version(command).await {
        Ok(Some(item)) => item_response(item),
        Ok(None) => not_found_response("prompt version was not found"),
        Err(error) => prompt_error_response("prompt version publish is unavailable", error),
    }
}

async fn render_version(
    State(state): State<AdminPromptState>,
    trusted: TrustedRequestSubject,
    headers: HeaderMap,
    Path(version_id): Path<String>,
    Json(request): Json<RenderPromptVersionRequest>,
) -> Response {
    let command = match build_render_version_command(trusted, &headers, &version_id, request) {
        Ok(command) => command,
        Err(response) => return response,
    };
    match state.store.render_version(command).await {
        Ok(Some(rendered)) => Json(PlusApiResult::success(AdminPromptRenderResponse {
            rendered,
        }))
        .into_response(),
        Ok(None) => not_found_response("prompt version was not found"),
        Err(error) => prompt_error_response("prompt version render is unavailable", error),
    }
}

async fn list_bindings(
    State(state): State<AdminPromptState>,
    trusted: TrustedRequestSubject,
    headers: HeaderMap,
    Path(prompt_id): Path<String>,
) -> Response {
    let query = match build_list_bindings_query(trusted, &headers, &prompt_id) {
        Ok(query) => query,
        Err(response) => return response,
    };
    match state.store.list_bindings(query).await {
        Ok(items) => list_response(items),
        Err(error) => prompt_error_response("prompt binding list is unavailable", error),
    }
}

async fn create_binding(
    State(state): State<AdminPromptState>,
    trusted: TrustedRequestSubject,
    headers: HeaderMap,
    Path(prompt_id): Path<String>,
    Json(request): Json<CreatePromptBindingRequest>,
) -> Response {
    let command = match build_create_binding_command(trusted, &headers, &prompt_id, request) {
        Ok(command) => command,
        Err(response) => return response,
    };
    match state.store.create_binding(command).await {
        Ok(item) => item_response(item),
        Err(error) => prompt_error_response("prompt binding create is unavailable", error),
    }
}

async fn update_binding(
    State(state): State<AdminPromptState>,
    trusted: TrustedRequestSubject,
    headers: HeaderMap,
    Path(binding_id): Path<String>,
    Json(request): Json<UpdatePromptBindingRequest>,
) -> Response {
    let command = match build_update_binding_command(trusted, &headers, &binding_id, request) {
        Ok(command) => command,
        Err(response) => return response,
    };
    match state.store.update_binding(command).await {
        Ok(Some(item)) => item_response(item),
        Ok(None) => not_found_response("prompt binding was not found"),
        Err(error) => prompt_error_response("prompt binding update is unavailable", error),
    }
}

fn build_list_prompts_query(
    trusted: TrustedRequestSubject,
    _headers: &HeaderMap,
    request: ListPromptsRequest,
) -> Result<ListAdminPromptsQuery, Response> {
    let subject = map_subject(trusted);
    let page_no = request.page.unwrap_or(DEFAULT_PAGE_NO);
    if page_no < 1 {
        return Err(bad_request("page must be greater than or equal to 1"));
    }
    let page_size = request.page_size.unwrap_or(DEFAULT_PAGE_SIZE);
    if !(1..=MAX_PAGE_SIZE).contains(&page_size) {
        return Err(bad_request(format!(
            "page_size must be between 1 and {MAX_PAGE_SIZE}"
        )));
    }
    Ok(ListAdminPromptsQuery {
        subject,
        keyword: normalize_optional_text(request.q, "q", MAX_KEY_LEN)?,
        prompt_type: normalize_optional_enum(request.prompt_type, "promptType")?,
        visibility: normalize_optional_enum(request.visibility, "visibility")?,
        status: normalize_optional_enum(request.status, "status")?,
        category_id: normalize_optional_id(request.category_id, "categoryId")?,
        page_no,
        page_size,
        offset: (page_no - 1) * page_size,
    })
}

fn build_create_prompt_command(
    trusted: TrustedRequestSubject,
    _headers: &HeaderMap,
    request: CreatePromptRequest,
) -> Result<CreateAdminPromptCommand, Response> {
    Ok(CreateAdminPromptCommand {
        subject: map_subject(trusted),
        prompt_key: normalize_required_key(request.prompt_key, "promptKey")?,
        name: normalize_required_text(request.name, "name", MAX_NAME_LEN)?,
        description: normalize_optional_text(
            request.description,
            "description",
            MAX_DESCRIPTION_LEN,
        )?,
        category_id: normalize_optional_id(request.category_id, "categoryId")?,
        prompt_type: normalize_optional_enum(request.prompt_type, "promptType")?
            .unwrap_or_else(|| "system".to_owned()),
        visibility: normalize_optional_enum(request.visibility, "visibility")?
            .unwrap_or_else(|| "organization".to_owned()),
        tags: normalize_tags(request.tags)?,
    })
}

fn build_list_versions_query(
    trusted: TrustedRequestSubject,
    _headers: &HeaderMap,
    prompt_id: &str,
) -> Result<ListAdminPromptVersionsQuery, Response> {
    Ok(ListAdminPromptVersionsQuery {
        subject: map_subject(trusted),
        prompt_id: parse_positive_i64(prompt_id, "promptId")?,
    })
}

fn build_create_version_command(
    trusted: TrustedRequestSubject,
    _headers: &HeaderMap,
    prompt_id: &str,
    request: CreatePromptVersionRequest,
) -> Result<CreateAdminPromptVersionCommand, Response> {
    Ok(CreateAdminPromptVersionCommand {
        subject: map_subject(trusted),
        prompt_id: parse_positive_i64(prompt_id, "promptId")?,
        version_no: normalize_required_key(request.version_no, "versionNo")?,
        title: normalize_required_text(request.title, "title", MAX_TITLE_LEN)?,
        content: normalize_required_text(request.content, "content", MAX_CONTENT_LEN)?,
        variable_schema: json_object_or_default(request.variable_schema, "variableSchema")?,
        output_schema: json_object_or_default(request.output_schema, "outputSchema")?,
        model_constraints: json_object_or_default(request.model_constraints, "modelConstraints")?,
        safety_policy: json_object_or_default(request.safety_policy, "safetyPolicy")?,
        examples_json: json_array_or_object_or_default(request.examples_json, "examplesJson")?,
    })
}

fn build_publish_version_command(
    trusted: TrustedRequestSubject,
    _headers: &HeaderMap,
    version_id: &str,
) -> Result<PublishAdminPromptVersionCommand, Response> {
    Ok(PublishAdminPromptVersionCommand {
        subject: map_subject(trusted),
        version_id: parse_positive_i64(version_id, "versionId")?,
    })
}

fn build_render_version_command(
    trusted: TrustedRequestSubject,
    _headers: &HeaderMap,
    version_id: &str,
    request: RenderPromptVersionRequest,
) -> Result<RenderAdminPromptVersionCommand, Response> {
    Ok(RenderAdminPromptVersionCommand {
        subject: map_subject(trusted),
        version_id: parse_positive_i64(version_id, "versionId")?,
        variables: json_object_or_default(request.variables, "variables")?,
    })
}

fn build_list_bindings_query(
    trusted: TrustedRequestSubject,
    _headers: &HeaderMap,
    prompt_id: &str,
) -> Result<ListAdminPromptBindingsQuery, Response> {
    Ok(ListAdminPromptBindingsQuery {
        subject: map_subject(trusted),
        prompt_id: parse_positive_i64(prompt_id, "promptId")?,
    })
}

fn build_create_binding_command(
    trusted: TrustedRequestSubject,
    _headers: &HeaderMap,
    prompt_id: &str,
    request: CreatePromptBindingRequest,
) -> Result<CreateAdminPromptBindingCommand, Response> {
    Ok(CreateAdminPromptBindingCommand {
        subject: map_subject(trusted),
        prompt_id: parse_positive_i64(prompt_id, "promptId")?,
        prompt_version_id: normalize_optional_positive_i64(
            request.prompt_version_id,
            "promptVersionId",
        )?,
        owner_type: normalize_required_text(request.owner_type, "ownerType", MAX_ENUM_LEN)?,
        owner_id: normalize_positive_i64(request.owner_id, "ownerId")?,
        binding_role: normalize_required_text(request.binding_role, "bindingRole", MAX_ENUM_LEN)?,
        priority: request.priority.unwrap_or(0),
        enabled: request.enabled.unwrap_or(true),
        policy_json: json_object_or_default(request.policy_json, "policyJson")?,
    })
}

fn build_update_binding_command(
    trusted: TrustedRequestSubject,
    _headers: &HeaderMap,
    binding_id: &str,
    request: UpdatePromptBindingRequest,
) -> Result<UpdateAdminPromptBindingCommand, Response> {
    Ok(UpdateAdminPromptBindingCommand {
        subject: map_subject(trusted),
        binding_id: parse_positive_i64(binding_id, "bindingId")?,
        prompt_version_id: normalize_nullable_positive_i64(
            request.prompt_version_id,
            "promptVersionId",
        )?,
        owner_type: request
            .owner_type
            .map(|value| normalize_required_text(value, "ownerType", MAX_ENUM_LEN))
            .transpose()?,
        owner_id: request
            .owner_id
            .map(|value| normalize_positive_i64(value, "ownerId"))
            .transpose()?,
        binding_role: request
            .binding_role
            .map(|value| normalize_required_text(value, "bindingRole", MAX_ENUM_LEN))
            .transpose()?,
        priority: request.priority,
        enabled: request.enabled,
        policy_json: request
            .policy_json
            .map(|value| json_object_or_default(Some(value), "policyJson"))
            .transpose()?,
    })
}

fn map_subject(trusted: TrustedRequestSubject) -> AdminPromptSubject {
    AdminPromptSubject {
        tenant_id: trusted.tenant_id,
        organization_id: trusted.organization_id,
        operator_id: trusted.operator_id,
        operator_type: trusted.operator_type,
    }
}

fn normalize_required_key(value: String, field_name: &str) -> Result<String, Response> {
    let value = normalize_required_text(value, field_name, MAX_KEY_LEN)?;
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b'.' | b':'))
    {
        return Err(bad_request(format!(
            "{field_name} contains unsupported characters"
        )));
    }
    Ok(value)
}

fn normalize_optional_enum(
    value: Option<String>,
    field_name: &str,
) -> Result<Option<String>, Response> {
    normalize_optional_text(value, field_name, MAX_ENUM_LEN)
        .map(|value| value.map(|value| value.to_ascii_lowercase()))
}

fn normalize_optional_id(
    value: Option<String>,
    field_name: &str,
) -> Result<Option<String>, Response> {
    let Some(value) = normalize_optional_text(value, field_name, MAX_KEY_LEN)? else {
        return Ok(None);
    };
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b'.' | b':'))
    {
        return Err(bad_request(format!(
            "{field_name} contains unsupported characters"
        )));
    }
    Ok(Some(value))
}

fn normalize_required_text(
    value: String,
    field_name: &str,
    max_len: usize,
) -> Result<String, Response> {
    normalize_optional_text(Some(value), field_name, max_len)?
        .ok_or_else(|| bad_request(format!("{field_name} is required")))
}

fn normalize_optional_text(
    value: Option<String>,
    field_name: &str,
    max_len: usize,
) -> Result<Option<String>, Response> {
    let Some(value) = value else {
        return Ok(None);
    };
    let value = value.trim();
    if value.is_empty() {
        return Ok(None);
    }
    if value.chars().count() > max_len || value.bytes().any(|byte| byte < 0x20) {
        return Err(bad_request(format!(
            "{field_name} must be at most {max_len} characters and contain no control characters"
        )));
    }
    Ok(Some(value.to_owned()))
}

fn normalize_tags(values: Option<Vec<String>>) -> Result<Vec<String>, Response> {
    let Some(values) = values else {
        return Ok(Vec::new());
    };
    if values.len() > MAX_TAGS {
        return Err(bad_request(format!(
            "tags must contain at most {MAX_TAGS} items"
        )));
    }
    let mut tags = Vec::new();
    for value in values {
        let Some(value) = normalize_optional_text(Some(value), "tags", MAX_TAG_LEN)? else {
            continue;
        };
        if !tags.contains(&value) {
            tags.push(value);
        }
    }
    Ok(tags)
}

fn normalize_optional_positive_i64(
    value: Option<i64>,
    field_name: &str,
) -> Result<Option<i64>, Response> {
    value
        .map(|value| normalize_positive_i64(value, field_name))
        .transpose()
}

fn normalize_nullable_positive_i64(
    value: Option<Value>,
    field_name: &str,
) -> Result<Option<Option<i64>>, Response> {
    match value {
        None => Ok(None),
        Some(Value::Null) => Ok(Some(None)),
        Some(Value::Number(number)) => {
            let Some(value) = number.as_i64() else {
                return Err(bad_request(format!(
                    "{field_name} must be a positive integer or null"
                )));
            };
            normalize_positive_i64(value, field_name).map(|value| Some(Some(value)))
        }
        Some(Value::String(value)) => {
            let value = value.trim().parse::<i64>().map_err(|_| {
                bad_request(format!("{field_name} must be a positive integer or null"))
            })?;
            normalize_positive_i64(value, field_name).map(|value| Some(Some(value)))
        }
        Some(_) => Err(bad_request(format!(
            "{field_name} must be a positive integer or null"
        ))),
    }
}

fn normalize_positive_i64(value: i64, field_name: &str) -> Result<i64, Response> {
    if value <= 0 {
        return Err(bad_request(format!(
            "{field_name} must be a positive integer"
        )));
    }
    Ok(value)
}

fn parse_positive_i64(value: &str, field_name: &str) -> Result<i64, Response> {
    let value = value
        .trim()
        .parse::<i64>()
        .map_err(|_| bad_request(format!("{field_name} must be a positive integer")))?;
    if value <= 0 {
        return Err(bad_request(format!(
            "{field_name} must be a positive integer"
        )));
    }
    Ok(value)
}

fn json_object_or_default(value: Option<Value>, field_name: &str) -> Result<Value, Response> {
    match value {
        Some(Value::Object(map)) => Ok(Value::Object(map)),
        Some(_) => Err(bad_request(format!("{field_name} must be a JSON object"))),
        None => Ok(Value::Object(Default::default())),
    }
}

fn json_array_or_object_or_default(
    value: Option<Value>,
    field_name: &str,
) -> Result<Value, Response> {
    match value {
        Some(Value::Object(map)) => Ok(Value::Object(map)),
        Some(Value::Array(items)) => Ok(Value::Array(items)),
        Some(_) => Err(bad_request(format!(
            "{field_name} must be a JSON object or array"
        ))),
        None => Ok(Value::Array(Vec::new())),
    }
}

fn list_response<T: Serialize>(items: Vec<T>) -> Response {
    Json(PlusApiResult::success(AdminPromptListResponse { items })).into_response()
}

fn item_response<T: Serialize>(item: T) -> Response {
    Json(PlusApiResult::success(AdminPromptItemEnvelope { item })).into_response()
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

fn prompt_error_response(context: &str, error: DomainError) -> Response {
    if error.is_not_found() {
        return not_found_response(error.to_string());
    }
    if error.is_conflict() {
        return conflict_response(error);
    }
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}
