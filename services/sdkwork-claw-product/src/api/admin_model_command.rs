use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Bytes;
use axum::extract::{Path, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, patch, post};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::infrastructure::sql::model_catalog_import::DEFAULT_CATALOG_REFRESH_SOURCE;
use crate::ports::{
    AdminAiModelItem, AdminModelCatalogSyncItem, AdminModelStore, AdminModelSubject,
    AdminModelVendorItem, CreateAdminAiModelCommand, CreateAdminModelVendorCommand,
    DeleteAdminAiModelCommand, ListAdminAiModelsQuery, ListAdminModelVendorsQuery,
    SyncAdminModelCatalogCommand, UpdateAdminAiModelCommand,
};

const REQUEST_ID_HEADER: &str = "X-Request-Id";
const MAX_REQUEST_ID_LEN: usize = 128;
const MAX_VENDOR_CODE_LEN: usize = 64;
const MAX_NAME_LEN: usize = 128;
const MAX_COLOR_LEN: usize = 64;
const MAX_DESCRIPTION_LEN: usize = 512;
const MAX_PUBLIC_DESCRIPTION_LEN: usize = 2048;
const MAX_CAPABILITY_INTRO_LEN: usize = 4096;
const MAX_TRAINING_DATA_CUTOFF_LEN: usize = 128;
const MAX_API_FORMAT_LEN: usize = 128;
const MAX_MODEL_METADATA_TEXT_LEN: usize = 512;
const MAX_MODEL_METADATA_ITEMS: usize = 128;
const MAX_SOURCE_LEN: usize = 64;
const MAX_SYNC_MODE_LEN: usize = 32;
const MAX_SYNC_VENDOR_CODES: usize = 32;
const MAX_CATALOG_ROOT_LEN: usize = 512;
const MAX_CATALOG_VERSION_LEN: usize = 128;
const MAX_MODEL_ID_LEN: usize = 128;
const MAX_CONTEXT_TOKENS: i64 = 100_000_000;
const MAX_OUTPUT_TOKENS: i64 = 100_000_000;
const INTEGRATION_PROVIDER_ONLY_CODES: &[&str] = &[
    "azure",
    "azure_ai",
    "azure_openai",
    "aws_bedrock",
    "bedrock",
    "gcp_vertex",
    "google_vertex",
    "ollama",
    "openrouter",
    "vertex",
    "vertex_ai",
];
const INTEGRATION_PROVIDER_ONLY_NAME_MARKERS: &[&str] = &[
    "aws bedrock",
    "azure openai",
    "google vertex",
    "openrouter",
    "ollama",
    "vertex ai",
];

#[derive(Clone)]
struct AdminModelCommandState {
    store: Arc<dyn AdminModelStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminModelVendorCreateRequest {
    vendor_code: Option<String>,
    name: Option<String>,
    status: Option<String>,
    color: Option<String>,
    description: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminAiModelCreateRequest {
    vendor_id: Option<Value>,
    name: Option<String>,
    #[serde(rename = "type")]
    model_type: Option<String>,
    price_in: Option<Value>,
    price_out: Option<Value>,
    context_tokens: Option<Value>,
    description: Option<String>,
    modalities: Option<Vec<String>>,
    input_modalities: Option<Vec<String>>,
    output_modalities: Option<Vec<String>>,
    api_format: Option<String>,
    capability_intro: Option<String>,
    limitations: Option<Vec<String>>,
    supported_languages: Option<Vec<String>>,
    use_cases: Option<Vec<String>>,
    training_data_cutoff: Option<String>,
    max_output_tokens: Option<Value>,
    supports_streaming: Option<bool>,
    supports_tools: Option<bool>,
    supports_json_schema: Option<bool>,
    release_stage: Option<Value>,
    shelf_state: Option<Value>,
    routing_state: Option<Value>,
    replacement_model: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminAiModelUpdateRequest {
    vendor_id: Option<Value>,
    name: Option<String>,
    #[serde(rename = "type")]
    model_type: Option<String>,
    price_in: Option<Value>,
    price_out: Option<Value>,
    status: Option<String>,
    context_tokens: Option<Value>,
    description: Option<String>,
    modalities: Option<Vec<String>>,
    input_modalities: Option<Vec<String>>,
    output_modalities: Option<Vec<String>>,
    api_format: Option<String>,
    capability_intro: Option<String>,
    limitations: Option<Vec<String>>,
    supported_languages: Option<Vec<String>>,
    use_cases: Option<Vec<String>>,
    training_data_cutoff: Option<String>,
    max_output_tokens: Option<Value>,
    supports_streaming: Option<bool>,
    supports_tools: Option<bool>,
    supports_json_schema: Option<bool>,
    release_stage: Option<Value>,
    shelf_state: Option<Value>,
    routing_state: Option<Value>,
    replacement_model: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminModelCatalogSyncRequest {
    source: Option<String>,
    mode: Option<String>,
    vendor_codes: Option<Vec<String>>,
    force: Option<bool>,
    catalog_root: Option<String>,
    catalog_version: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct NormalizedVendorCreateRequest {
    vendor_code: String,
    name: String,
    status: String,
    color: String,
    description: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct NormalizedModelCreateRequest {
    vendor_id: String,
    model: String,
    model_type: String,
    price_in: String,
    price_out: String,
    description: Option<String>,
    modalities: Vec<String>,
    input_modalities: Vec<String>,
    output_modalities: Vec<String>,
    api_format: String,
    capability_intro: Option<String>,
    limitations: Vec<String>,
    supported_languages: Vec<String>,
    use_cases: Vec<String>,
    training_data_cutoff: Option<String>,
    context_tokens: i64,
    max_output_tokens: Option<i64>,
    supports_streaming: bool,
    supports_tools: bool,
    supports_json_schema: bool,
    release_stage: i32,
    shelf_state: i32,
    routing_state: i32,
    replacement_model: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct NormalizedModelUpdateRequest {
    vendor_id: Option<String>,
    model: Option<String>,
    model_type: Option<String>,
    price_in: Option<String>,
    price_out: Option<String>,
    status: Option<String>,
    description: Option<Option<String>>,
    modalities: Option<Vec<String>>,
    input_modalities: Option<Vec<String>>,
    output_modalities: Option<Vec<String>>,
    api_format: Option<String>,
    capability_intro: Option<Option<String>>,
    limitations: Option<Vec<String>>,
    supported_languages: Option<Vec<String>>,
    use_cases: Option<Vec<String>>,
    training_data_cutoff: Option<Option<String>>,
    context_tokens: Option<i64>,
    max_output_tokens: Option<Option<i64>>,
    supports_streaming: Option<bool>,
    supports_tools: Option<bool>,
    supports_json_schema: Option<bool>,
    release_stage: Option<i32>,
    shelf_state: Option<i32>,
    routing_state: Option<i32>,
    replacement_model: Option<Option<String>>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminModelListResponse<T> {
    items: Vec<T>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminModelItemEnvelope<T> {
    item: T,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminModelCatalogSyncResponse {
    synced: bool,
    source: String,
    mode: String,
    dry_run: bool,
    catalog_version: String,
    requested_catalog_version: Option<String>,
    catalog_root: Option<String>,
    vendor_codes: Vec<String>,
    source_hash: String,
    meter_count: usize,
    vendor_count: usize,
    family_count: usize,
    model_count: usize,
    capability_count: usize,
    price_count: usize,
    ranking_count: usize,
    accepted_count: i64,
    snapshot_id: Option<String>,
    sync_run_id: Option<String>,
    vendors: Vec<AdminModelVendorItemResponse>,
    models: Vec<AdminAiModelItemResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminModelVendorItemResponse {
    id: String,
    vendor_code: String,
    name: String,
    status: String,
    color: String,
    description: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAiModelItemResponse {
    id: String,
    vendor_id: String,
    vendor_code: String,
    name: String,
    #[serde(rename = "type")]
    model_type: String,
    price_in: String,
    price_out: String,
    status: String,
    calls: String,
    description: Option<String>,
    modalities: Vec<String>,
    input_modalities: Vec<String>,
    output_modalities: Vec<String>,
    api_format: Option<String>,
    capability_intro: Option<String>,
    limitations: Vec<String>,
    supported_languages: Vec<String>,
    use_cases: Vec<String>,
    training_data_cutoff: Option<String>,
    context_tokens: Option<i64>,
    max_output_tokens: Option<i64>,
    supports_streaming: bool,
    supports_tools: bool,
    supports_json_schema: bool,
    release_stage: Option<i32>,
    shelf_state: Option<i32>,
    routing_state: Option<i32>,
    replacement_model: Option<String>,
}

enum AdminModelCommandBuildError {
    BadRequest(String),
    System(DomainError),
}

pub fn admin_model_management_router_with_store(
    store: Arc<dyn AdminModelStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/ai/model_vendors",
            get(fetch_vendors).post(create_vendor),
        )
        .route(
            "/backend/v3/api/ai/models",
            get(fetch_models).post(create_model),
        )
        .route("/backend/v3/api/ai/models/refresh", post(sync_catalog))
        .route(
            "/backend/v3/api/ai/models/{model_id}",
            patch(update_model).delete(delete_model),
        )
        .with_state(AdminModelCommandState {
            store,
            entity_uuid_generator,
        })
}

async fn fetch_vendors(
    State(state): State<AdminModelCommandState>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .store
        .list_vendors(ListAdminModelVendorsQuery { subject })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AdminModelListResponse {
            items: items.into_iter().map(to_vendor_response).collect(),
        }))
        .into_response(),
        Err(error) => admin_model_system_response("model vendor read model is unavailable", error),
    }
}

async fn fetch_models(State(state): State<AdminModelCommandState>, headers: HeaderMap) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .store
        .list_models(ListAdminAiModelsQuery { subject })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AdminModelListResponse {
            items: items.into_iter().map(to_model_response).collect(),
        }))
        .into_response(),
        Err(error) => admin_model_system_response("ai model read model is unavailable", error),
    }
}

async fn create_vendor(
    State(state): State<AdminModelCommandState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<AdminModelVendorCreateRequest>(&body, "model vendor") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_vendor_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.create_vendor(command).await {
        Ok(item) => Json(PlusApiResult::success(AdminModelItemEnvelope {
            item: to_vendor_response(item),
        }))
        .into_response(),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => {
            admin_model_system_response("model vendor command store is unavailable", error)
        }
    }
}

async fn create_model(
    State(state): State<AdminModelCommandState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<AdminAiModelCreateRequest>(&body, "ai model") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_model_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.create_model(command).await {
        Ok(item) => Json(PlusApiResult::success(AdminModelItemEnvelope {
            item: to_model_response(item),
        }))
        .into_response(),
        Err(error) if error.is_not_found() => not_found_response(error.to_string()),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => admin_model_system_response("ai model command store is unavailable", error),
    }
}

async fn update_model(
    State(state): State<AdminModelCommandState>,
    Path(model_id): Path<String>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<AdminAiModelUpdateRequest>(&body, "ai model update") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command =
        match build_update_model_command(state.clone(), &headers, subject, model_id, request) {
            Ok(command) => command,
            Err(error) => return command_build_error_response(error),
        };
    match state.store.update_model(command).await {
        Ok(item) => Json(PlusApiResult::success(AdminModelItemEnvelope {
            item: to_model_response(item),
        }))
        .into_response(),
        Err(error) if error.is_not_found() => not_found_response(error.to_string()),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => admin_model_system_response("ai model update store is unavailable", error),
    }
}

async fn delete_model(
    State(state): State<AdminModelCommandState>,
    Path(model_id): Path<String>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let command = match build_delete_model_command(state.clone(), &headers, subject, model_id) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.delete_model(command).await {
        Ok(()) => Json(PlusApiResult::success(
            serde_json::json!({ "deleted": true }),
        ))
        .into_response(),
        Err(error) if error.is_not_found() => not_found_response(error.to_string()),
        Err(error) => admin_model_system_response("ai model delete store is unavailable", error),
    }
}

async fn sync_catalog(
    State(state): State<AdminModelCommandState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request =
        match parse_optional_json_body::<AdminModelCatalogSyncRequest>(&body, "model catalog sync")
        {
            Ok(request) => request,
            Err(message) => return bad_request(message),
        };
    let command = match build_sync_catalog_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };
    match state.store.sync_catalog(command).await {
        Ok(item) => Json(PlusApiResult::success(to_sync_response(item))).into_response(),
        Err(error) => admin_model_system_response("model catalog sync store is unavailable", error),
    }
}

fn resolve_subject(headers: &HeaderMap) -> Result<AdminModelSubject, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| AdminModelSubject {
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

fn parse_optional_json_body<T>(body: &[u8], entity_name: &str) -> Result<T, String>
where
    T: Default + for<'de> Deserialize<'de>,
{
    if body.iter().all(u8::is_ascii_whitespace) {
        return Ok(T::default());
    }
    serde_json::from_slice(body)
        .map_err(|error| format!("invalid {entity_name} request body: {error}"))
}

impl Default for AdminModelCatalogSyncRequest {
    fn default() -> Self {
        Self {
            source: None,
            mode: None,
            vendor_codes: None,
            force: None,
            catalog_root: None,
            catalog_version: None,
        }
    }
}

fn build_create_vendor_command(
    state: AdminModelCommandState,
    headers: &HeaderMap,
    subject: AdminModelSubject,
    request: AdminModelVendorCreateRequest,
) -> Result<CreateAdminModelVendorCommand, AdminModelCommandBuildError> {
    let vendor_uuid = generate_entity_uuid(&state)?;
    let request = normalize_vendor_create_request(request, &vendor_uuid)?;
    Ok(CreateAdminModelVendorCommand {
        subject,
        vendor_uuid,
        audit_log_uuid: generate_entity_uuid(&state)?,
        vendor_code: request.vendor_code,
        name: request.name,
        status: request.status,
        color: request.color,
        description: request.description,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_create_model_command(
    state: AdminModelCommandState,
    headers: &HeaderMap,
    subject: AdminModelSubject,
    request: AdminAiModelCreateRequest,
) -> Result<CreateAdminAiModelCommand, AdminModelCommandBuildError> {
    let request = normalize_model_create_request(request)?;
    Ok(CreateAdminAiModelCommand {
        subject,
        model_uuid: generate_entity_uuid(&state)?,
        input_pricing_uuid: generate_entity_uuid(&state)?,
        output_pricing_uuid: generate_entity_uuid(&state)?,
        capability_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        vendor_id: request.vendor_id,
        model: request.model,
        model_type: request.model_type,
        price_in: request.price_in,
        price_out: request.price_out,
        description: request.description,
        modalities: request.modalities,
        input_modalities: request.input_modalities,
        output_modalities: request.output_modalities,
        api_format: request.api_format,
        capability_intro: request.capability_intro,
        limitations: request.limitations,
        supported_languages: request.supported_languages,
        use_cases: request.use_cases,
        training_data_cutoff: request.training_data_cutoff,
        context_tokens: request.context_tokens,
        max_output_tokens: request.max_output_tokens,
        supports_streaming: request.supports_streaming,
        supports_tools: request.supports_tools,
        supports_json_schema: request.supports_json_schema,
        release_stage: request.release_stage,
        shelf_state: request.shelf_state,
        routing_state: request.routing_state,
        replacement_model: request.replacement_model,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_model_command(
    state: AdminModelCommandState,
    headers: &HeaderMap,
    subject: AdminModelSubject,
    model_id: String,
    request: AdminAiModelUpdateRequest,
) -> Result<UpdateAdminAiModelCommand, AdminModelCommandBuildError> {
    let request = normalize_model_update_request(request)?;
    Ok(UpdateAdminAiModelCommand {
        subject,
        capability_uuid: generate_entity_uuid(&state)?,
        input_pricing_uuid: generate_entity_uuid(&state)?,
        output_pricing_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        model_id: normalize_model_id(&model_id)?,
        vendor_id: request.vendor_id,
        model: request.model,
        model_type: request.model_type,
        price_in: request.price_in,
        price_out: request.price_out,
        status: request.status,
        description: request.description,
        modalities: request.modalities,
        input_modalities: request.input_modalities,
        output_modalities: request.output_modalities,
        api_format: request.api_format,
        capability_intro: request.capability_intro,
        limitations: request.limitations,
        supported_languages: request.supported_languages,
        use_cases: request.use_cases,
        training_data_cutoff: request.training_data_cutoff,
        context_tokens: request.context_tokens,
        max_output_tokens: request.max_output_tokens,
        supports_streaming: request.supports_streaming,
        supports_tools: request.supports_tools,
        supports_json_schema: request.supports_json_schema,
        release_stage: request.release_stage,
        shelf_state: request.shelf_state,
        routing_state: request.routing_state,
        replacement_model: request.replacement_model,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_sync_catalog_command(
    state: AdminModelCommandState,
    headers: &HeaderMap,
    subject: AdminModelSubject,
    request: AdminModelCatalogSyncRequest,
) -> Result<SyncAdminModelCatalogCommand, AdminModelCommandBuildError> {
    Ok(SyncAdminModelCatalogCommand {
        subject,
        snapshot_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        source: normalize_source(request.source.as_deref())?,
        mode: normalize_sync_mode(request.mode.as_deref())?,
        vendor_codes: normalize_sync_vendor_codes(request.vendor_codes)?,
        force: request.force.unwrap_or(false),
        catalog_root: normalize_optional_catalog_root(request.catalog_root.as_deref())?,
        catalog_version: normalize_optional_catalog_version(request.catalog_version.as_deref())?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_delete_model_command(
    state: AdminModelCommandState,
    headers: &HeaderMap,
    subject: AdminModelSubject,
    model_id: String,
) -> Result<DeleteAdminAiModelCommand, AdminModelCommandBuildError> {
    Ok(DeleteAdminAiModelCommand {
        subject,
        audit_log_uuid: generate_entity_uuid(&state)?,
        model_id: normalize_model_id(&model_id)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn normalize_vendor_create_request(
    request: AdminModelVendorCreateRequest,
    vendor_uuid: &str,
) -> Result<NormalizedVendorCreateRequest, AdminModelCommandBuildError> {
    let name = normalize_required_text(request.name.as_deref(), "vendor name", MAX_NAME_LEN)?;
    let vendor_code = request
        .vendor_code
        .as_deref()
        .map(|value| normalize_code(value, "vendorCode", MAX_VENDOR_CODE_LEN))
        .transpose()?
        .unwrap_or_else(|| vendor_code_from_name(&name, vendor_uuid));
    reject_integration_provider_as_model_vendor(&vendor_code, &name)?;
    Ok(NormalizedVendorCreateRequest {
        vendor_code,
        name,
        status: normalize_status(request.status.as_deref())?,
        color: normalize_color(request.color.as_deref())?,
        description: normalize_optional_text(
            request.description.as_deref(),
            "description",
            MAX_DESCRIPTION_LEN,
        )?,
    })
}

fn normalize_model_create_request(
    request: AdminAiModelCreateRequest,
) -> Result<NormalizedModelCreateRequest, AdminModelCommandBuildError> {
    let model_type = normalize_model_type(request.model_type.as_deref())?;
    let defaults = model_defaults(&model_type);
    let context_tokens = normalize_positive_i64(
        request.context_tokens.as_ref(),
        "contextTokens",
        MAX_CONTEXT_TOKENS,
    )?;
    let modalities = normalize_text_array(
        request.modalities,
        "modalities",
        MAX_MODEL_METADATA_ITEMS,
        MAX_MODEL_METADATA_TEXT_LEN,
    )?
    .unwrap_or_else(|| defaults.modalities.clone());
    let input_modalities = normalize_text_array(
        request.input_modalities,
        "inputModalities",
        MAX_MODEL_METADATA_ITEMS,
        MAX_MODEL_METADATA_TEXT_LEN,
    )?
    .unwrap_or_else(|| defaults.input_modalities.clone());
    let output_modalities = normalize_text_array(
        request.output_modalities,
        "outputModalities",
        MAX_MODEL_METADATA_ITEMS,
        MAX_MODEL_METADATA_TEXT_LEN,
    )?
    .unwrap_or_else(|| defaults.output_modalities.clone());
    Ok(NormalizedModelCreateRequest {
        vendor_id: normalize_value_text(request.vendor_id.as_ref(), "vendorId", MAX_NAME_LEN)?,
        model: normalize_model_name(request.name.as_deref())?,
        model_type,
        price_in: normalize_decimal_amount(request.price_in.as_ref(), "priceIn")?,
        price_out: normalize_decimal_amount(request.price_out.as_ref(), "priceOut")?,
        description: normalize_nullable_text(
            request.description.as_deref(),
            "description",
            MAX_PUBLIC_DESCRIPTION_LEN,
        )?,
        modalities,
        input_modalities,
        output_modalities,
        api_format: normalize_model_code(
            request.api_format.as_deref(),
            "apiFormat",
            MAX_API_FORMAT_LEN,
        )?
        .unwrap_or_else(|| defaults.api_format.to_owned()),
        capability_intro: normalize_nullable_text(
            request.capability_intro.as_deref(),
            "capabilityIntro",
            MAX_CAPABILITY_INTRO_LEN,
        )?,
        limitations: normalize_text_array(
            request.limitations,
            "limitations",
            MAX_MODEL_METADATA_ITEMS,
            MAX_MODEL_METADATA_TEXT_LEN,
        )?
        .unwrap_or_default(),
        supported_languages: normalize_text_array(
            request.supported_languages,
            "supportedLanguages",
            MAX_MODEL_METADATA_ITEMS,
            MAX_MODEL_METADATA_TEXT_LEN,
        )?
        .unwrap_or_default(),
        use_cases: normalize_text_array(
            request.use_cases,
            "useCases",
            MAX_MODEL_METADATA_ITEMS,
            MAX_MODEL_METADATA_TEXT_LEN,
        )?
        .unwrap_or_default(),
        training_data_cutoff: normalize_nullable_text(
            request.training_data_cutoff.as_deref(),
            "trainingDataCutoff",
            MAX_TRAINING_DATA_CUTOFF_LEN,
        )?,
        context_tokens,
        max_output_tokens: normalize_optional_positive_i64(
            request.max_output_tokens.as_ref(),
            "maxOutputTokens",
            MAX_OUTPUT_TOKENS,
        )?,
        supports_streaming: request
            .supports_streaming
            .unwrap_or(defaults.supports_streaming),
        supports_tools: request.supports_tools.unwrap_or(defaults.supports_tools),
        supports_json_schema: request
            .supports_json_schema
            .unwrap_or(defaults.supports_json_schema),
        release_stage: normalize_enum_i32(request.release_stage.as_ref(), "releaseStage", 1, 3)?
            .unwrap_or(1),
        shelf_state: normalize_enum_i32(request.shelf_state.as_ref(), "shelfState", 1, 3)?
            .unwrap_or(1),
        routing_state: normalize_enum_i32(request.routing_state.as_ref(), "routingState", 0, 2)?
            .unwrap_or(1),
        replacement_model: normalize_nullable_model_name(
            request.replacement_model.as_deref(),
            "replacementModel",
        )?,
    })
}

fn normalize_model_update_request(
    request: AdminAiModelUpdateRequest,
) -> Result<NormalizedModelUpdateRequest, AdminModelCommandBuildError> {
    let model_type = request
        .model_type
        .as_deref()
        .map(|value| normalize_model_type(Some(value)))
        .transpose()?;
    let defaults = model_type.as_deref().map(model_defaults);
    let modalities = normalize_text_array(
        request.modalities,
        "modalities",
        MAX_MODEL_METADATA_ITEMS,
        MAX_MODEL_METADATA_TEXT_LEN,
    )?
    .or_else(|| defaults.as_ref().map(|value| value.modalities.clone()));
    let input_modalities = normalize_text_array(
        request.input_modalities,
        "inputModalities",
        MAX_MODEL_METADATA_ITEMS,
        MAX_MODEL_METADATA_TEXT_LEN,
    )?
    .or_else(|| {
        defaults
            .as_ref()
            .map(|value| value.input_modalities.clone())
    });
    let output_modalities = normalize_text_array(
        request.output_modalities,
        "outputModalities",
        MAX_MODEL_METADATA_ITEMS,
        MAX_MODEL_METADATA_TEXT_LEN,
    )?
    .or_else(|| {
        defaults
            .as_ref()
            .map(|value| value.output_modalities.clone())
    });
    let api_format = normalize_model_code(
        request.api_format.as_deref(),
        "apiFormat",
        MAX_API_FORMAT_LEN,
    )?
    .or_else(|| defaults.as_ref().map(|value| value.api_format.to_owned()));
    Ok(NormalizedModelUpdateRequest {
        vendor_id: request
            .vendor_id
            .as_ref()
            .map(|value| normalize_value_text(Some(value), "vendorId", MAX_NAME_LEN))
            .transpose()?,
        model: request
            .name
            .as_deref()
            .map(|value| normalize_model_name(Some(value)))
            .transpose()?,
        model_type,
        price_in: request
            .price_in
            .as_ref()
            .map(|value| normalize_decimal_amount(Some(value), "priceIn"))
            .transpose()?,
        price_out: request
            .price_out
            .as_ref()
            .map(|value| normalize_decimal_amount(Some(value), "priceOut"))
            .transpose()?,
        status: request
            .status
            .as_deref()
            .map(|value| normalize_status(Some(value)))
            .transpose()?,
        description: request
            .description
            .as_deref()
            .map(|value| {
                normalize_nullable_text(Some(value), "description", MAX_PUBLIC_DESCRIPTION_LEN)
            })
            .transpose()?,
        modalities,
        input_modalities,
        output_modalities,
        api_format,
        capability_intro: request
            .capability_intro
            .as_deref()
            .map(|value| {
                normalize_nullable_text(Some(value), "capabilityIntro", MAX_CAPABILITY_INTRO_LEN)
            })
            .transpose()?,
        limitations: normalize_text_array(
            request.limitations,
            "limitations",
            MAX_MODEL_METADATA_ITEMS,
            MAX_MODEL_METADATA_TEXT_LEN,
        )?,
        supported_languages: normalize_text_array(
            request.supported_languages,
            "supportedLanguages",
            MAX_MODEL_METADATA_ITEMS,
            MAX_MODEL_METADATA_TEXT_LEN,
        )?,
        use_cases: normalize_text_array(
            request.use_cases,
            "useCases",
            MAX_MODEL_METADATA_ITEMS,
            MAX_MODEL_METADATA_TEXT_LEN,
        )?,
        training_data_cutoff: request
            .training_data_cutoff
            .as_deref()
            .map(|value| {
                normalize_nullable_text(
                    Some(value),
                    "trainingDataCutoff",
                    MAX_TRAINING_DATA_CUTOFF_LEN,
                )
            })
            .transpose()?,
        context_tokens: request
            .context_tokens
            .as_ref()
            .map(|value| normalize_positive_i64(Some(value), "contextTokens", MAX_CONTEXT_TOKENS))
            .transpose()?,
        max_output_tokens: request
            .max_output_tokens
            .as_ref()
            .map(|value| {
                normalize_optional_positive_i64(Some(value), "maxOutputTokens", MAX_OUTPUT_TOKENS)
            })
            .transpose()?,
        supports_streaming: request
            .supports_streaming
            .or_else(|| defaults.as_ref().map(|value| value.supports_streaming)),
        supports_tools: request
            .supports_tools
            .or_else(|| defaults.as_ref().map(|value| value.supports_tools)),
        supports_json_schema: request
            .supports_json_schema
            .or_else(|| defaults.as_ref().map(|value| value.supports_json_schema)),
        release_stage: normalize_enum_i32(request.release_stage.as_ref(), "releaseStage", 1, 3)?,
        shelf_state: normalize_enum_i32(request.shelf_state.as_ref(), "shelfState", 1, 3)?,
        routing_state: normalize_enum_i32(request.routing_state.as_ref(), "routingState", 0, 2)?,
        replacement_model: request
            .replacement_model
            .as_deref()
            .map(|value| normalize_nullable_model_name(Some(value), "replacementModel"))
            .transpose()?,
    })
}

fn normalize_required_text(
    value: Option<&str>,
    field_name: &str,
    max_len: usize,
) -> Result<String, AdminModelCommandBuildError> {
    let value = value.unwrap_or("").trim();
    if value.is_empty() {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} is required"
        )));
    }
    if value.chars().count() > max_len {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must be at most {max_len} characters"
        )));
    }
    if value.chars().any(char::is_control) {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must not contain control characters"
        )));
    }
    Ok(value.to_owned())
}

fn normalize_optional_text(
    value: Option<&str>,
    field_name: &str,
    max_len: usize,
) -> Result<String, AdminModelCommandBuildError> {
    let value = value.unwrap_or("").trim();
    if value.chars().count() > max_len {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must be at most {max_len} characters"
        )));
    }
    if value.chars().any(char::is_control) {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must not contain control characters"
        )));
    }
    Ok(value.to_owned())
}

fn normalize_nullable_text(
    value: Option<&str>,
    field_name: &str,
    max_len: usize,
) -> Result<Option<String>, AdminModelCommandBuildError> {
    let value = normalize_optional_text(value, field_name, max_len)?;
    Ok((!value.is_empty()).then_some(value))
}

fn normalize_value_text(
    value: Option<&Value>,
    field_name: &str,
    max_len: usize,
) -> Result<String, AdminModelCommandBuildError> {
    let raw = match value {
        Some(Value::String(value)) => value.trim().to_owned(),
        Some(Value::Number(value)) => value.to_string(),
        _ => String::new(),
    };
    normalize_required_text(Some(&raw), field_name, max_len)
}

fn normalize_model_name(value: Option<&str>) -> Result<String, AdminModelCommandBuildError> {
    let value = normalize_required_text(value, "model name", MAX_NAME_LEN)?;
    if !value.bytes().all(|byte| {
        byte.is_ascii_alphanumeric() || matches!(byte, b'.' | b'_' | b':' | b'/' | b'-')
    }) {
        return Err(AdminModelCommandBuildError::BadRequest(
            "model name must use ASCII letters, numbers, dot, underscore, colon, slash, or hyphen"
                .to_owned(),
        ));
    }
    Ok(value)
}

fn normalize_nullable_model_name(
    value: Option<&str>,
    field_name: &str,
) -> Result<Option<String>, AdminModelCommandBuildError> {
    let value = normalize_nullable_text(value, field_name, MAX_NAME_LEN)?;
    match value {
        Some(value) => normalize_model_name(Some(&value)).map(Some),
        None => Ok(None),
    }
}

fn normalize_model_code(
    value: Option<&str>,
    field_name: &str,
    max_len: usize,
) -> Result<Option<String>, AdminModelCommandBuildError> {
    let value = normalize_nullable_text(value, field_name, max_len)?;
    let Some(value) = value else {
        return Ok(None);
    };
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_'))
    {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must use ASCII letters, numbers, hyphen, or underscore"
        )));
    }
    Ok(Some(value.replace('-', "_")))
}

fn normalize_model_type(value: Option<&str>) -> Result<String, AdminModelCommandBuildError> {
    let value = value.unwrap_or("Chat").trim().to_ascii_lowercase();
    match value.as_str() {
        "chat" | "llm" | "text" => Ok("Chat".to_owned()),
        "image" => Ok("Image".to_owned()),
        "audio" | "speech" => Ok("Audio".to_owned()),
        "embedding" | "embeddings" => Ok("Embedding".to_owned()),
        "music" => Ok("Music".to_owned()),
        "sfx" | "soundeffect" | "sound_effect" | "sound_effects" | "sound effect"
        | "sound effects" => Ok("SoundEffect".to_owned()),
        "video" => Ok("Video".to_owned()),
        _ => Err(AdminModelCommandBuildError::BadRequest(
            "type must be Chat, Image, Audio, Embedding, Music, SoundEffect, or Video".to_owned(),
        )),
    }
}

fn normalize_status(value: Option<&str>) -> Result<String, AdminModelCommandBuildError> {
    match value
        .unwrap_or("active")
        .trim()
        .to_ascii_lowercase()
        .as_str()
    {
        "active" | "enabled" | "normal" => Ok("active".to_owned()),
        "inactive" | "disabled" => Ok("inactive".to_owned()),
        _ => Err(AdminModelCommandBuildError::BadRequest(
            "status must be active or inactive".to_owned(),
        )),
    }
}

fn normalize_color(value: Option<&str>) -> Result<String, AdminModelCommandBuildError> {
    let value = value.unwrap_or("bg-slate-700").trim();
    if value.is_empty() {
        return Ok("bg-slate-700".to_owned());
    }
    if value.chars().count() > MAX_COLOR_LEN
        || !value.bytes().all(|byte| {
            byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b':' | b'/' | b'#')
        })
    {
        return Err(AdminModelCommandBuildError::BadRequest(
            "color must be a safe style token".to_owned(),
        ));
    }
    Ok(value.to_owned())
}

fn normalize_code(
    value: &str,
    field_name: &str,
    max_len: usize,
) -> Result<String, AdminModelCommandBuildError> {
    let code = slugify(value);
    if code.is_empty() {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} is invalid"
        )));
    }
    if code.len() > max_len {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must be at most {max_len} bytes after normalization"
        )));
    }
    Ok(code)
}

fn vendor_code_from_name(name: &str, vendor_uuid: &str) -> String {
    let code = slugify(name);
    if !code.is_empty() && code.len() <= MAX_VENDOR_CODE_LEN {
        return code;
    }
    let short = vendor_uuid.chars().take(16).collect::<String>();
    format!("custom_{short}")
        .chars()
        .take(MAX_VENDOR_CODE_LEN)
        .collect()
}

fn reject_integration_provider_as_model_vendor(
    vendor_code: &str,
    name: &str,
) -> Result<(), AdminModelCommandBuildError> {
    let code = vendor_code.trim().to_ascii_lowercase();
    let normalized_name = name
        .trim()
        .to_ascii_lowercase()
        .replace(['-', '_', '.', '/'], " ");
    if INTEGRATION_PROVIDER_ONLY_CODES.contains(&code.as_str())
        || INTEGRATION_PROVIDER_ONLY_NAME_MARKERS
            .iter()
            .any(|marker| normalized_name.contains(marker))
    {
        return Err(AdminModelCommandBuildError::BadRequest(
            "model vendor must be the model publisher; cloud, relay, local runtime, and aggregator access belongs in integration_provider".to_owned(),
        ));
    }
    Ok(())
}

fn slugify(value: &str) -> String {
    let mut result = String::new();
    let mut last_was_separator = false;
    for byte in value.bytes() {
        let next = if byte.is_ascii_alphanumeric() {
            Some((byte as char).to_ascii_lowercase())
        } else if matches!(byte, b'-' | b'_' | b' ' | b'.' | b'/') {
            Some('_')
        } else {
            None
        };
        if let Some(ch) = next {
            if ch == '_' {
                if !result.is_empty() && !last_was_separator {
                    result.push('_');
                    last_was_separator = true;
                }
            } else {
                result.push(ch);
                last_was_separator = false;
            }
        }
    }
    while result.ends_with('_') {
        result.pop();
    }
    result
}

fn normalize_decimal_amount(
    value: Option<&Value>,
    field_name: &str,
) -> Result<String, AdminModelCommandBuildError> {
    let raw = match value {
        Some(Value::String(value)) => value.trim().to_owned(),
        Some(Value::Number(value)) => value.to_string(),
        _ => String::new(),
    };
    if raw.is_empty() {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} is required"
        )));
    }
    let value = raw.trim().trim_start_matches('$').replace(',', "");
    if value.is_empty()
        || value.starts_with('-')
        || value.starts_with('+')
        || value.contains('e')
        || value.contains('E')
    {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must be a positive decimal amount"
        )));
    }
    let parts: Vec<&str> = value.split('.').collect();
    if parts.len() > 2
        || parts[0].is_empty()
        || !parts[0].chars().all(|ch| ch.is_ascii_digit())
        || parts
            .get(1)
            .map(|part| !part.chars().all(|ch| ch.is_ascii_digit()) || part.len() > 12)
            .unwrap_or(false)
        || parts[0].len() > 24
    {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must be a valid decimal amount with at most 12 decimal places"
        )));
    }
    let whole = parts[0].trim_start_matches('0');
    let whole = if whole.is_empty() { "0" } else { whole };
    let mut fraction = parts
        .get(1)
        .copied()
        .unwrap_or("")
        .trim_end_matches('0')
        .to_owned();
    let has_non_zero = whole != "0" || fraction.chars().any(|ch| ch != '0');
    if !has_non_zero {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must be greater than zero"
        )));
    }
    while fraction.len() < 6 {
        fraction.push('0');
    }
    Ok(format!("{whole}.{fraction}"))
}

fn normalize_positive_i64(
    value: Option<&Value>,
    field_name: &str,
    max_value: i64,
) -> Result<i64, AdminModelCommandBuildError> {
    let raw = match value {
        Some(Value::String(value)) => value.trim().to_owned(),
        Some(Value::Number(value)) => value.to_string(),
        _ => String::new(),
    };
    if raw.is_empty() {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} is required"
        )));
    }
    let normalized = raw.replace(',', "").replace('_', "");
    let (number, multiplier) = match normalized.chars().last() {
        Some('k') | Some('K') => (&normalized[..normalized.len() - 1], 1_000_i64),
        Some('m') | Some('M') => (&normalized[..normalized.len() - 1], 1_000_000_i64),
        _ => (normalized.as_str(), 1_i64),
    };
    let value = number.parse::<i64>().map_err(|_| {
        AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must be a positive integer, K, or M token count"
        ))
    })?;
    let value = value.checked_mul(multiplier).ok_or_else(|| {
        AdminModelCommandBuildError::BadRequest(format!("{field_name} is too large"))
    })?;
    if !(1..=max_value).contains(&value) {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must be between 1 and {max_value}"
        )));
    }
    Ok(value)
}

fn normalize_optional_positive_i64(
    value: Option<&Value>,
    field_name: &str,
    max_value: i64,
) -> Result<Option<i64>, AdminModelCommandBuildError> {
    match value {
        Some(Value::Null) => Ok(None),
        Some(Value::String(value)) if value.trim().is_empty() => Ok(None),
        Some(_) => normalize_positive_i64(value, field_name, max_value).map(Some),
        None => Ok(None),
    }
}

fn normalize_enum_i32(
    value: Option<&Value>,
    field_name: &str,
    min_value: i32,
    max_value: i32,
) -> Result<Option<i32>, AdminModelCommandBuildError> {
    let Some(value) = value else {
        return Ok(None);
    };
    if value.is_null() {
        return Ok(None);
    }
    let raw = match value {
        Value::String(value) => value.trim().to_owned(),
        Value::Number(value) => value.to_string(),
        _ => String::new(),
    };
    if raw.is_empty() {
        return Ok(None);
    }
    let value = raw.parse::<i32>().map_err(|_| {
        AdminModelCommandBuildError::BadRequest(format!("{field_name} must be an integer"))
    })?;
    if !(min_value..=max_value).contains(&value) {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must be between {min_value} and {max_value}"
        )));
    }
    Ok(Some(value))
}

fn normalize_text_array(
    value: Option<Vec<String>>,
    field_name: &str,
    max_items: usize,
    max_item_len: usize,
) -> Result<Option<Vec<String>>, AdminModelCommandBuildError> {
    let Some(values) = value else {
        return Ok(None);
    };
    if values.len() > max_items {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "{field_name} must contain at most {max_items} items"
        )));
    }
    let mut normalized = Vec::new();
    for value in values {
        let value = normalize_optional_text(Some(&value), field_name, max_item_len)?;
        if !value.is_empty() && !normalized.contains(&value) {
            normalized.push(value);
        }
    }
    Ok(Some(normalized))
}

fn normalize_model_id(value: &str) -> Result<String, AdminModelCommandBuildError> {
    let value = normalize_required_text(Some(value), "modelId", MAX_MODEL_ID_LEN)?;
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_'))
    {
        return Err(AdminModelCommandBuildError::BadRequest(
            "modelId must use ASCII letters, numbers, hyphen, or underscore".to_owned(),
        ));
    }
    Ok(value)
}

fn normalize_source(value: Option<&str>) -> Result<String, AdminModelCommandBuildError> {
    let value = value.unwrap_or(DEFAULT_CATALOG_REFRESH_SOURCE).trim();
    if value.is_empty() {
        return Ok(DEFAULT_CATALOG_REFRESH_SOURCE.to_owned());
    }
    if value.len() > MAX_SOURCE_LEN
        || !value
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_'))
    {
        return Err(AdminModelCommandBuildError::BadRequest(
            "source must contain only letters, numbers, -, and _".to_owned(),
        ));
    }
    Ok(value.to_ascii_lowercase())
}

fn normalize_sync_mode(value: Option<&str>) -> Result<String, AdminModelCommandBuildError> {
    let value = value.unwrap_or("official_refresh").trim();
    if value.is_empty() {
        return Ok("official_refresh".to_owned());
    }
    if value.len() > MAX_SYNC_MODE_LEN
        || !value
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_'))
    {
        return Err(AdminModelCommandBuildError::BadRequest(
            "mode must contain only letters, numbers, -, and _".to_owned(),
        ));
    }
    let value = value.to_ascii_lowercase();
    if !matches!(
        value.as_str(),
        "official_refresh" | "vendor_refresh" | "catalog_version_refresh" | "dry_run"
    ) {
        return Err(AdminModelCommandBuildError::BadRequest(
            "mode must be official_refresh, vendor_refresh, catalog_version_refresh, or dry_run"
                .to_owned(),
        ));
    }
    Ok(value)
}

fn normalize_sync_vendor_codes(
    value: Option<Vec<String>>,
) -> Result<Vec<String>, AdminModelCommandBuildError> {
    let Some(value) = value else {
        return Ok(Vec::new());
    };
    if value.len() > MAX_SYNC_VENDOR_CODES {
        return Err(AdminModelCommandBuildError::BadRequest(format!(
            "vendorCodes must contain {MAX_SYNC_VENDOR_CODES} items or fewer"
        )));
    }
    let mut vendor_codes = Vec::new();
    for item in value {
        let item = normalize_code(&item, "vendorCodes", MAX_VENDOR_CODE_LEN)?;
        if !vendor_codes.iter().any(|existing| existing == &item) {
            vendor_codes.push(item);
        }
    }
    Ok(vendor_codes)
}

fn normalize_optional_catalog_root(
    value: Option<&str>,
) -> Result<Option<String>, AdminModelCommandBuildError> {
    let value = normalize_optional_text(value, "catalogRoot", MAX_CATALOG_ROOT_LEN)?;
    if value.is_empty() {
        return Ok(None);
    }
    if value.chars().any(char::is_control) {
        return Err(AdminModelCommandBuildError::BadRequest(
            "catalogRoot must not contain control characters".to_owned(),
        ));
    }
    Ok(Some(value))
}

fn normalize_optional_catalog_version(
    value: Option<&str>,
) -> Result<Option<String>, AdminModelCommandBuildError> {
    let value = normalize_optional_text(value, "catalogVersion", MAX_CATALOG_VERSION_LEN)?;
    if value.is_empty() {
        return Ok(None);
    }
    if !value
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'.' | b'-' | b'_'))
    {
        return Err(AdminModelCommandBuildError::BadRequest(
            "catalogVersion must contain only letters, numbers, ., -, and _".to_owned(),
        ));
    }
    Ok(Some(value))
}

fn generate_entity_uuid(
    state: &AdminModelCommandState,
) -> Result<String, AdminModelCommandBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(AdminModelCommandBuildError::System)
}

fn normalize_request_id(
    headers: &HeaderMap,
    state: &AdminModelCommandState,
) -> Result<String, AdminModelCommandBuildError> {
    if let Some(value) = header_value(headers, REQUEST_ID_HEADER) {
        if value.chars().count() > MAX_REQUEST_ID_LEN
            || !value.bytes().all(|byte| (0x21..=0x7e).contains(&byte))
        {
            return Err(AdminModelCommandBuildError::BadRequest(format!(
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

fn to_vendor_response(item: AdminModelVendorItem) -> AdminModelVendorItemResponse {
    AdminModelVendorItemResponse {
        id: item.id.to_string(),
        vendor_code: item.vendor_code,
        name: item.name,
        status: item.status,
        color: item.color,
        description: item.description,
    }
}

fn to_model_response(item: AdminAiModelItem) -> AdminAiModelItemResponse {
    AdminAiModelItemResponse {
        id: item.id.to_string(),
        vendor_id: item.vendor_id,
        vendor_code: item.vendor_code,
        name: item.name,
        model_type: item.model_type,
        price_in: item.price_in,
        price_out: item.price_out,
        status: item.status,
        calls: item.calls,
        description: item.description,
        modalities: item.modalities,
        input_modalities: item.input_modalities,
        output_modalities: item.output_modalities,
        api_format: item.api_format,
        capability_intro: item.capability_intro,
        limitations: item.limitations,
        supported_languages: item.supported_languages,
        use_cases: item.use_cases,
        training_data_cutoff: item.training_data_cutoff,
        context_tokens: item.context_tokens,
        max_output_tokens: item.max_output_tokens,
        supports_streaming: item.supports_streaming,
        supports_tools: item.supports_tools,
        supports_json_schema: item.supports_json_schema,
        release_stage: item.release_stage,
        shelf_state: item.shelf_state,
        routing_state: item.routing_state,
        replacement_model: item.replacement_model,
    }
}

#[derive(Debug, Clone)]
struct ModelDefaults {
    modalities: Vec<String>,
    input_modalities: Vec<String>,
    output_modalities: Vec<String>,
    api_format: &'static str,
    supports_streaming: bool,
    supports_tools: bool,
    supports_json_schema: bool,
}

fn model_defaults(model_type: &str) -> ModelDefaults {
    match model_type {
        "Image" => ModelDefaults {
            modalities: vec!["image".to_owned()],
            input_modalities: vec!["text".to_owned(), "image".to_owned()],
            output_modalities: vec!["image".to_owned()],
            api_format: "openai_compatible",
            supports_streaming: false,
            supports_tools: false,
            supports_json_schema: false,
        },
        "Audio" => ModelDefaults {
            modalities: vec!["audio".to_owned()],
            input_modalities: vec!["audio".to_owned(), "text".to_owned()],
            output_modalities: vec!["audio".to_owned(), "text".to_owned()],
            api_format: "openai_compatible",
            supports_streaming: false,
            supports_tools: false,
            supports_json_schema: false,
        },
        "Embedding" => ModelDefaults {
            modalities: vec!["embedding".to_owned()],
            input_modalities: vec!["text".to_owned()],
            output_modalities: vec!["embedding".to_owned()],
            api_format: "openai_compatible",
            supports_streaming: false,
            supports_tools: false,
            supports_json_schema: false,
        },
        "Music" => ModelDefaults {
            modalities: vec!["music".to_owned()],
            input_modalities: vec!["text".to_owned(), "audio".to_owned()],
            output_modalities: vec!["audio".to_owned()],
            api_format: "openai_compatible",
            supports_streaming: false,
            supports_tools: false,
            supports_json_schema: false,
        },
        "SoundEffect" => ModelDefaults {
            modalities: vec!["sfx".to_owned()],
            input_modalities: vec!["text".to_owned(), "audio".to_owned()],
            output_modalities: vec!["audio".to_owned()],
            api_format: "openai_compatible",
            supports_streaming: false,
            supports_tools: false,
            supports_json_schema: false,
        },
        "Video" => ModelDefaults {
            modalities: vec!["video".to_owned()],
            input_modalities: vec!["text".to_owned(), "image".to_owned(), "video".to_owned()],
            output_modalities: vec!["video".to_owned()],
            api_format: "openai_compatible",
            supports_streaming: false,
            supports_tools: false,
            supports_json_schema: false,
        },
        _ => ModelDefaults {
            modalities: vec!["text".to_owned()],
            input_modalities: vec!["text".to_owned(), "image".to_owned()],
            output_modalities: vec!["text".to_owned()],
            api_format: "openai_responses",
            supports_streaming: true,
            supports_tools: true,
            supports_json_schema: true,
        },
    }
}

fn to_sync_response(item: AdminModelCatalogSyncItem) -> AdminModelCatalogSyncResponse {
    AdminModelCatalogSyncResponse {
        synced: item.synced,
        source: item.source,
        mode: item.mode,
        dry_run: item.dry_run,
        catalog_version: item.catalog_version,
        requested_catalog_version: item.requested_catalog_version,
        catalog_root: item.catalog_root,
        vendor_codes: item.vendor_codes,
        source_hash: item.source_hash,
        meter_count: item.meter_count,
        vendor_count: item.vendor_count,
        family_count: item.family_count,
        model_count: item.model_count,
        capability_count: item.capability_count,
        price_count: item.price_count,
        ranking_count: item.ranking_count,
        accepted_count: item.accepted_count,
        snapshot_id: item.snapshot_id,
        sync_run_id: item.sync_run_id,
        vendors: item.vendors.into_iter().map(to_vendor_response).collect(),
        models: item.models.into_iter().map(to_model_response).collect(),
    }
}

fn bad_request(message: impl Into<String>) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(PlusApiResult::error("4001", message.into())),
    )
        .into_response()
}

fn not_found_response(message: String) -> Response {
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

fn command_build_error_response(error: AdminModelCommandBuildError) -> Response {
    match error {
        AdminModelCommandBuildError::BadRequest(message) => bad_request(message),
        AdminModelCommandBuildError::System(error) => {
            admin_model_system_response("admin model command is invalid", error)
        }
    }
}

fn admin_model_system_response(context: &str, error: DomainError) -> Response {
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
