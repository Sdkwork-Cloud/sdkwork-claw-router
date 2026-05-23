use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Bytes;
use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode, Uri};
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, get, patch};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};

use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::ports::{
    AdminOpenPlatformAccountItem, AdminOpenPlatformEntryItem, AdminOpenPlatformManifestItem,
    AdminOpenPlatformPayBindingItem, AdminOpenPlatformProviderItem, AdminOpenPlatformStore,
    AdminOpenPlatformSubject, CreateAdminOpenPlatformAccountCommand,
    CreateAdminOpenPlatformEntryCommand, CreateAdminOpenPlatformPayBindingCommand,
    DeleteAdminOpenPlatformAccountCommand, DeleteAdminOpenPlatformEntryCommand,
    DeleteAdminOpenPlatformPayBindingCommand, GetAdminOpenPlatformAccountQuery,
    ListAdminOpenPlatformAccountsQuery, ListAdminOpenPlatformEntriesQuery,
    ListAdminOpenPlatformManifestsQuery, ListAdminOpenPlatformPayBindingsQuery,
    ListAdminOpenPlatformProvidersQuery, UpdateAdminOpenPlatformAccountCommand,
    UpdateAdminOpenPlatformEntryCommand,
};

const DEFAULT_PAGE_NO: i64 = 1;
const DEFAULT_PAGE_SIZE: i64 = 50;
const MAX_PAGE_SIZE: i64 = 200;
const MAX_KEY_LEN: usize = 128;
const MAX_NAME_LEN: usize = 128;
const MAX_REF_LEN: usize = 256;
const MAX_ID_TEXT_LEN: usize = 128;
const MAX_URL_LEN: usize = 1024;
const MAX_REQUEST_ID_LEN: usize = 128;
const REQUEST_ID_HEADER: &str = "X-Request-Id";

const PROVIDERS: &[&str] = &["wechat", "alipay", "douyin", "baidu", "kuaishou", "feishu"];
const ACCOUNT_TYPES: &[&str] = &["official_account", "mini_app", "life_account", "bot"];
const ENTRY_TYPES: &[&str] = &["url", "qr", "mini_app_url"];
const STATUSES: &[&str] = &["active", "inactive"];
const PAY_SCENES: &[&str] = &["official_account", "mini_app", "h5", "app"];
const PAY_MODES: &[&str] = &["direct", "cashier", "escrow"];
const ENTRY_URL_SCHEMES: &[&str] = &[
    "http",
    "https",
    "weixin",
    "alipay",
    "snssdk1128",
    "baiduboxapp",
    "kwai",
    "feishu",
];

#[derive(Clone)]
struct AdminOpenPlatformState {
    store: Arc<dyn AdminOpenPlatformStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
}

#[derive(Debug, Default, Deserialize)]
struct ProviderListQuery {
    status: Option<String>,
}

#[derive(Debug, Default, Deserialize)]
struct ManifestListQuery {
    provider: Option<String>,
    #[serde(rename = "type")]
    account_type: Option<String>,
    status: Option<String>,
}

#[derive(Debug, Default, Deserialize)]
struct AccountListQuery {
    provider: Option<String>,
    #[serde(rename = "type")]
    account_type: Option<String>,
    status: Option<String>,
    page: Option<i64>,
    page_size: Option<i64>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct NormalizedCreateAccountRequest {
    key: String,
    name: String,
    provider: String,
    account_type: String,
    app_id: Option<String>,
    secret_ref: Option<String>,
    token_ref: Option<String>,
    aes_key_ref: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct NormalizedUpdateAccountRequest {
    name: Option<String>,
    app_id: Option<Option<String>>,
    secret_ref: Option<Option<String>>,
    token_ref: Option<Option<String>>,
    aes_key_ref: Option<Option<String>>,
    default_entry_id: Option<Option<i64>>,
    qr_default: Option<bool>,
    status: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct NormalizedCreateEntryRequest {
    key: String,
    entry_type: String,
    url: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct NormalizedUpdateEntryRequest {
    key: Option<String>,
    entry_type: Option<String>,
    url: Option<String>,
    status: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct NormalizedCreatePayBindingRequest {
    payment_account_id: String,
    payment_channel_id: Option<String>,
    scene: String,
    mode: String,
}

enum OpenPlatformCommandBuildError {
    BadRequest(String),
    System(DomainError),
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformProviderListResponse {
    items: Vec<AdminOpenPlatformProviderItemResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformProviderItemResponse {
    id: String,
    provider: String,
    name: String,
    status: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformManifestListResponse {
    items: Vec<AdminOpenPlatformManifestItemResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformManifestItemResponse {
    id: String,
    key: String,
    provider: String,
    #[serde(rename = "type")]
    account_type: String,
    version: String,
    status: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformAccountListResponse {
    items: Vec<AdminOpenPlatformAccountItemResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformAccountItemEnvelope {
    item: AdminOpenPlatformAccountItemResponse,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformAccountItemResponse {
    id: String,
    key: String,
    name: String,
    provider: String,
    #[serde(rename = "type")]
    account_type: String,
    app_id: Option<String>,
    secret_ref: Option<String>,
    token_ref: Option<String>,
    aes_key_ref: Option<String>,
    default_entry_id: Option<String>,
    qr_default: bool,
    status: String,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformEntryListResponse {
    items: Vec<AdminOpenPlatformEntryItemResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformEntryItemEnvelope {
    item: AdminOpenPlatformEntryItemResponse,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformEntryItemResponse {
    id: String,
    account_id: String,
    key: String,
    #[serde(rename = "type")]
    entry_type: String,
    url: String,
    status: String,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformPayBindingListResponse {
    items: Vec<AdminOpenPlatformPayBindingItemResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformPayBindingItemEnvelope {
    item: AdminOpenPlatformPayBindingItemResponse,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminOpenPlatformPayBindingItemResponse {
    id: String,
    account_id: String,
    payment_account_id: String,
    payment_channel_id: Option<String>,
    scene: String,
    mode: String,
    status: String,
    created_at: String,
    updated_at: String,
}

pub fn admin_open_platform_router_with_store(
    store: Arc<dyn AdminOpenPlatformStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/open_platform/providers",
            get(list_providers),
        )
        .route(
            "/backend/v3/api/open_platform/manifests",
            get(list_manifests),
        )
        .route(
            "/backend/v3/api/open_platform/accounts",
            get(list_accounts).post(create_account),
        )
        .route(
            "/backend/v3/api/open_platform/accounts/{account_id}",
            get(get_account)
                .patch(update_account)
                .delete(delete_account),
        )
        .route(
            "/backend/v3/api/open_platform/accounts/{account_id}/entries",
            get(list_entries).post(create_entry),
        )
        .route(
            "/backend/v3/api/open_platform/accounts/{account_id}/entries/{entry_id}",
            patch(update_entry).delete(delete_entry),
        )
        .route(
            "/backend/v3/api/open_platform/accounts/{account_id}/pay_bindings",
            get(list_pay_bindings).post(create_pay_binding),
        )
        .route(
            "/backend/v3/api/open_platform/accounts/{account_id}/pay_bindings/{binding_id}",
            delete(delete_pay_binding),
        )
        .with_state(AdminOpenPlatformState {
            store,
            entity_uuid_generator,
        })
}

async fn list_providers(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Query(query): Query<ProviderListQuery>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let status = match normalize_enum_filter(query.status, "provider status", STATUSES) {
        Ok(status) => status,
        Err(message) => return bad_request(message),
    };

    match state
        .store
        .list_providers(ListAdminOpenPlatformProvidersQuery { subject, status })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(
            AdminOpenPlatformProviderListResponse {
                items: items.into_iter().map(to_provider_response).collect(),
            },
        ))
        .into_response(),
        Err(error) => {
            open_platform_system_response("open platform provider read model is unavailable", error)
        }
    }
}

async fn list_manifests(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Query(query): Query<ManifestListQuery>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let provider = match normalize_enum_filter(query.provider, "provider", PROVIDERS) {
        Ok(provider) => provider,
        Err(message) => return bad_request(message),
    };
    let account_type =
        match normalize_enum_filter(query.account_type, "account type", ACCOUNT_TYPES) {
            Ok(account_type) => account_type,
            Err(message) => return bad_request(message),
        };
    let status = match normalize_enum_filter(query.status, "manifest status", STATUSES) {
        Ok(status) => status,
        Err(message) => return bad_request(message),
    };

    match state
        .store
        .list_manifests(ListAdminOpenPlatformManifestsQuery {
            subject,
            provider,
            account_type,
            status,
        })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(
            AdminOpenPlatformManifestListResponse {
                items: items.into_iter().map(to_manifest_response).collect(),
            },
        ))
        .into_response(),
        Err(error) => {
            open_platform_system_response("open platform manifest read model is unavailable", error)
        }
    }
}

async fn list_accounts(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Query(query): Query<AccountListQuery>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match build_account_list_query(subject, query) {
        Ok(query) => query,
        Err(message) => return bad_request(message),
    };

    match state.store.list_accounts(query).await {
        Ok(items) => Json(PlusApiResult::success(
            AdminOpenPlatformAccountListResponse {
                items: items.into_iter().map(to_account_response).collect(),
            },
        ))
        .into_response(),
        Err(error) => {
            open_platform_system_response("open platform account read model is unavailable", error)
        }
    }
}

async fn get_account(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Path(account_id): Path<String>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let account_id = match parse_positive_id(&account_id, "open platform account id") {
        Ok(account_id) => account_id,
        Err(message) => return bad_request(message),
    };

    match state
        .store
        .get_account(GetAdminOpenPlatformAccountQuery {
            subject,
            account_id,
        })
        .await
    {
        Ok(Some(item)) => Json(PlusApiResult::success(
            AdminOpenPlatformAccountItemEnvelope {
                item: to_account_response(item),
            },
        ))
        .into_response(),
        Ok(None) => not_found_response("open platform account was not found"),
        Err(error) => {
            open_platform_system_response("open platform account read model is unavailable", error)
        }
    }
}

async fn create_account(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_object(&body, "open platform account request body is required") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let request = match normalize_create_account_request(request) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_account_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.create_account(command).await {
        Ok(item) => Json(PlusApiResult::success(
            AdminOpenPlatformAccountItemEnvelope {
                item: to_account_response(item),
            },
        ))
        .into_response(),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => open_platform_system_response(
            "open platform account command store is unavailable",
            error,
        ),
    }
}

async fn update_account(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Path(account_id): Path<String>,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let account_id = match parse_positive_id(&account_id, "open platform account id") {
        Ok(account_id) => account_id,
        Err(message) => return bad_request(message),
    };
    let request = match parse_json_object(&body, "open platform account update body is required") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let request = match normalize_update_account_request(request) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command =
        match build_update_account_command(state.clone(), &headers, subject, account_id, request) {
            Ok(command) => command,
            Err(error) => return command_build_error_response(error),
        };

    match state.store.update_account(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(
            AdminOpenPlatformAccountItemEnvelope {
                item: to_account_response(item),
            },
        ))
        .into_response(),
        Ok(None) => not_found_response("open platform account was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => open_platform_system_response(
            "open platform account command store is unavailable",
            error,
        ),
    }
}

async fn delete_account(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Path(account_id): Path<String>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let account_id = match parse_positive_id(&account_id, "open platform account id") {
        Ok(account_id) => account_id,
        Err(message) => return bad_request(message),
    };
    let command = match build_delete_account_command(state.clone(), &headers, subject, account_id) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.delete_account(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(
            AdminOpenPlatformAccountItemEnvelope {
                item: to_account_response(item),
            },
        ))
        .into_response(),
        Ok(None) => not_found_response("open platform account was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => open_platform_system_response(
            "open platform account command store is unavailable",
            error,
        ),
    }
}

async fn list_entries(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Path(account_id): Path<String>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let account_id = match parse_positive_id(&account_id, "open platform account id") {
        Ok(account_id) => account_id,
        Err(message) => return bad_request(message),
    };

    match state
        .store
        .list_entries(ListAdminOpenPlatformEntriesQuery {
            subject,
            account_id,
        })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(AdminOpenPlatformEntryListResponse {
            items: items.into_iter().map(to_entry_response).collect(),
        }))
        .into_response(),
        Err(error) => {
            open_platform_system_response("open platform entry read model is unavailable", error)
        }
    }
}

async fn create_entry(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Path(account_id): Path<String>,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let account_id = match parse_positive_id(&account_id, "open platform account id") {
        Ok(account_id) => account_id,
        Err(message) => return bad_request(message),
    };
    let request = match parse_json_object(&body, "open platform entry request body is required") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let request = match normalize_create_entry_request(request) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command =
        match build_create_entry_command(state.clone(), &headers, subject, account_id, request) {
            Ok(command) => command,
            Err(error) => return command_build_error_response(error),
        };

    match state.store.create_entry(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminOpenPlatformEntryItemEnvelope {
            item: to_entry_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("open platform account was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => {
            open_platform_system_response("open platform entry command store is unavailable", error)
        }
    }
}

async fn update_entry(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Path((account_id, entry_id)): Path<(String, String)>,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let account_id = match parse_positive_id(&account_id, "open platform account id") {
        Ok(account_id) => account_id,
        Err(message) => return bad_request(message),
    };
    let entry_id = match parse_positive_id(&entry_id, "open platform entry id") {
        Ok(entry_id) => entry_id,
        Err(message) => return bad_request(message),
    };
    let request = match parse_json_object(&body, "open platform entry update body is required") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let request = match normalize_update_entry_request(request) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_update_entry_command(
        state.clone(),
        &headers,
        subject,
        account_id,
        entry_id,
        request,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.update_entry(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminOpenPlatformEntryItemEnvelope {
            item: to_entry_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("open platform entry was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => {
            open_platform_system_response("open platform entry command store is unavailable", error)
        }
    }
}

async fn delete_entry(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Path((account_id, entry_id)): Path<(String, String)>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let account_id = match parse_positive_id(&account_id, "open platform account id") {
        Ok(account_id) => account_id,
        Err(message) => return bad_request(message),
    };
    let entry_id = match parse_positive_id(&entry_id, "open platform entry id") {
        Ok(entry_id) => entry_id,
        Err(message) => return bad_request(message),
    };
    let command =
        match build_delete_entry_command(state.clone(), &headers, subject, account_id, entry_id) {
            Ok(command) => command,
            Err(error) => return command_build_error_response(error),
        };

    match state.store.delete_entry(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(AdminOpenPlatformEntryItemEnvelope {
            item: to_entry_response(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("open platform entry was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => {
            open_platform_system_response("open platform entry command store is unavailable", error)
        }
    }
}

async fn list_pay_bindings(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Path(account_id): Path<String>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let account_id = match parse_positive_id(&account_id, "open platform account id") {
        Ok(account_id) => account_id,
        Err(message) => return bad_request(message),
    };

    match state
        .store
        .list_pay_bindings(ListAdminOpenPlatformPayBindingsQuery {
            subject,
            account_id,
        })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(
            AdminOpenPlatformPayBindingListResponse {
                items: items.into_iter().map(to_pay_binding_response).collect(),
            },
        ))
        .into_response(),
        Err(error) => open_platform_system_response(
            "open platform pay binding read model is unavailable",
            error,
        ),
    }
}

async fn create_pay_binding(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Path(account_id): Path<String>,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let account_id = match parse_positive_id(&account_id, "open platform account id") {
        Ok(account_id) => account_id,
        Err(message) => return bad_request(message),
    };
    let request =
        match parse_json_object(&body, "open platform pay binding request body is required") {
            Ok(request) => request,
            Err(message) => return bad_request(message),
        };
    let request = match normalize_create_pay_binding_request(request) {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_pay_binding_command(
        state.clone(),
        &headers,
        subject,
        account_id,
        request,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.create_pay_binding(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(
            AdminOpenPlatformPayBindingItemEnvelope {
                item: to_pay_binding_response(item),
            },
        ))
        .into_response(),
        Ok(None) => not_found_response("open platform account was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => open_platform_system_response(
            "open platform pay binding command store is unavailable",
            error,
        ),
    }
}

async fn delete_pay_binding(
    State(state): State<AdminOpenPlatformState>,
    headers: HeaderMap,
    Path((account_id, binding_id)): Path<(String, String)>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let account_id = match parse_positive_id(&account_id, "open platform account id") {
        Ok(account_id) => account_id,
        Err(message) => return bad_request(message),
    };
    let binding_id = match parse_positive_id(&binding_id, "open platform pay binding id") {
        Ok(binding_id) => binding_id,
        Err(message) => return bad_request(message),
    };
    let command = match build_delete_pay_binding_command(
        state.clone(),
        &headers,
        subject,
        account_id,
        binding_id,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.delete_pay_binding(command).await {
        Ok(Some(item)) => Json(PlusApiResult::success(
            AdminOpenPlatformPayBindingItemEnvelope {
                item: to_pay_binding_response(item),
            },
        ))
        .into_response(),
        Ok(None) => not_found_response("open platform pay binding was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => open_platform_system_response(
            "open platform pay binding command store is unavailable",
            error,
        ),
    }
}

fn resolve_subject(headers: &HeaderMap) -> Result<AdminOpenPlatformSubject, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| AdminOpenPlatformSubject {
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

fn build_account_list_query(
    subject: AdminOpenPlatformSubject,
    query: AccountListQuery,
) -> Result<ListAdminOpenPlatformAccountsQuery, String> {
    let page_no = query.page.unwrap_or(DEFAULT_PAGE_NO);
    if page_no < 1 {
        return Err("page must be greater than or equal to 1".to_owned());
    }
    let page_size = query.page_size.unwrap_or(DEFAULT_PAGE_SIZE);
    if !(1..=MAX_PAGE_SIZE).contains(&page_size) {
        return Err(format!("page_size must be between 1 and {MAX_PAGE_SIZE}"));
    }

    Ok(ListAdminOpenPlatformAccountsQuery {
        subject,
        provider: normalize_enum_filter(query.provider, "provider", PROVIDERS)?,
        account_type: normalize_enum_filter(query.account_type, "account type", ACCOUNT_TYPES)?,
        status: normalize_enum_filter(query.status, "account status", STATUSES)?,
        page_no,
        page_size,
        offset: (page_no - 1) * page_size,
    })
}

fn parse_json_object(
    body: &[u8],
    required_message: &'static str,
) -> Result<Map<String, Value>, String> {
    if body.iter().all(u8::is_ascii_whitespace) {
        return Err(required_message.to_owned());
    }
    match serde_json::from_slice::<Value>(body)
        .map_err(|error| format!("invalid open platform request body: {error}"))?
    {
        Value::Object(object) => Ok(object),
        _ => Err("open platform request body must be a JSON object".to_owned()),
    }
}

fn normalize_create_account_request(
    request: Map<String, Value>,
) -> Result<NormalizedCreateAccountRequest, String> {
    let key = normalize_key(
        &required_text(&request, "key", "open platform account key", MAX_KEY_LEN)?,
        "open platform account key",
    )?;
    reject_plaintext_secret_values(&request)?;
    Ok(NormalizedCreateAccountRequest {
        key,
        name: required_text(&request, "name", "open platform account name", MAX_NAME_LEN)?,
        provider: normalize_required_enum(&request, "provider", "provider", PROVIDERS)?,
        account_type: normalize_required_enum(&request, "type", "account type", ACCOUNT_TYPES)?,
        app_id: normalize_nullable_text_for_create(&request, "appId", "appId", MAX_ID_TEXT_LEN)?,
        secret_ref: normalize_nullable_secret_ref_for_create(&request, "secretRef", "secretRef")?,
        token_ref: normalize_nullable_secret_ref_for_create(&request, "tokenRef", "tokenRef")?,
        aes_key_ref: normalize_nullable_secret_ref_for_create(&request, "aesKeyRef", "aesKeyRef")?,
    })
}

fn normalize_update_account_request(
    request: Map<String, Value>,
) -> Result<NormalizedUpdateAccountRequest, String> {
    reject_plaintext_secret_values(&request)?;
    let request = NormalizedUpdateAccountRequest {
        name: optional_text(&request, "name", "open platform account name", MAX_NAME_LEN)?,
        app_id: normalize_nullable_text_for_update(&request, "appId", "appId", MAX_ID_TEXT_LEN)?,
        secret_ref: normalize_nullable_secret_ref_for_update(&request, "secretRef", "secretRef")?,
        token_ref: normalize_nullable_secret_ref_for_update(&request, "tokenRef", "tokenRef")?,
        aes_key_ref: normalize_nullable_secret_ref_for_update(&request, "aesKeyRef", "aesKeyRef")?,
        default_entry_id: normalize_nullable_id_for_update(
            &request,
            "defaultEntryId",
            "defaultEntryId",
        )?,
        qr_default: optional_bool(&request, "qrDefault", "qrDefault")?,
        status: optional_text(&request, "status", "account status", 32)?
            .map(|status| normalize_enum_value(status, "account status", STATUSES))
            .transpose()?,
    };

    if request.name.is_none()
        && request.app_id.is_none()
        && request.secret_ref.is_none()
        && request.token_ref.is_none()
        && request.aes_key_ref.is_none()
        && request.default_entry_id.is_none()
        && request.qr_default.is_none()
        && request.status.is_none()
    {
        return Err(
            "open platform account update must include at least one editable field".to_owned(),
        );
    }
    Ok(request)
}

fn normalize_create_entry_request(
    request: Map<String, Value>,
) -> Result<NormalizedCreateEntryRequest, String> {
    let url = required_text(&request, "url", "entry url", MAX_URL_LEN)?;
    validate_entry_url(&url)?;
    Ok(NormalizedCreateEntryRequest {
        key: normalize_key(
            &required_text(&request, "key", "open platform entry key", MAX_KEY_LEN)?,
            "open platform entry key",
        )?,
        entry_type: normalize_required_enum(&request, "type", "entry type", ENTRY_TYPES)?,
        url,
    })
}

fn normalize_update_entry_request(
    request: Map<String, Value>,
) -> Result<NormalizedUpdateEntryRequest, String> {
    let key = optional_text(&request, "key", "open platform entry key", MAX_KEY_LEN)?
        .map(|key| normalize_key(&key, "open platform entry key"))
        .transpose()?;
    let entry_type = optional_text(&request, "type", "entry type", 32)?
        .map(|entry_type| normalize_enum_value(entry_type, "entry type", ENTRY_TYPES))
        .transpose()?;
    let url = optional_text(&request, "url", "entry url", MAX_URL_LEN)?;
    if let Some(url) = url.as_deref() {
        validate_entry_url(url)?;
    }
    let status = optional_text(&request, "status", "entry status", 32)?
        .map(|status| normalize_enum_value(status, "entry status", STATUSES))
        .transpose()?;
    let request = NormalizedUpdateEntryRequest {
        key,
        entry_type,
        url,
        status,
    };
    if request.key.is_none()
        && request.entry_type.is_none()
        && request.url.is_none()
        && request.status.is_none()
    {
        return Err(
            "open platform entry update must include at least one editable field".to_owned(),
        );
    }
    Ok(request)
}

fn normalize_create_pay_binding_request(
    request: Map<String, Value>,
) -> Result<NormalizedCreatePayBindingRequest, String> {
    Ok(NormalizedCreatePayBindingRequest {
        payment_account_id: required_text(
            &request,
            "paymentAccountId",
            "paymentAccountId",
            MAX_ID_TEXT_LEN,
        )?,
        payment_channel_id: normalize_nullable_text_for_create(
            &request,
            "paymentChannelId",
            "paymentChannelId",
            MAX_ID_TEXT_LEN,
        )?,
        scene: normalize_required_enum(&request, "scene", "pay scene", PAY_SCENES)?,
        mode: normalize_required_enum(&request, "mode", "pay mode", PAY_MODES)?,
    })
}

fn normalize_required_enum(
    request: &Map<String, Value>,
    key: &str,
    field_name: &str,
    allowed: &[&str],
) -> Result<String, String> {
    normalize_enum_value(
        required_text(request, key, field_name, 64)?,
        field_name,
        allowed,
    )
}

fn normalize_enum_filter(
    value: Option<String>,
    field_name: &str,
    allowed: &[&str],
) -> Result<Option<String>, String> {
    value
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(|value| normalize_enum_value(value.to_owned(), field_name, allowed))
        .transpose()
}

fn normalize_enum_value(
    value: String,
    field_name: &str,
    allowed: &[&str],
) -> Result<String, String> {
    let value = value.trim().to_ascii_lowercase();
    if allowed.contains(&value.as_str()) {
        Ok(value)
    } else {
        Err(format!("{field_name} is not supported"))
    }
}

fn normalize_key(value: &str, field_name: &str) -> Result<String, String> {
    let value = value.trim();
    if value.is_empty() {
        return Err(format!("{field_name} is required"));
    }
    if value.chars().count() > MAX_KEY_LEN {
        return Err(format!(
            "{field_name} must be at most {MAX_KEY_LEN} characters"
        ));
    }
    let mut bytes = value.bytes();
    let Some(first) = bytes.next() else {
        return Err(format!("{field_name} is required"));
    };
    if !first.is_ascii_lowercase() && !first.is_ascii_digit() {
        return Err(format!(
            "{field_name} must start with a lowercase letter or number"
        ));
    }
    if !bytes.all(|byte| {
        byte.is_ascii_lowercase()
            || byte.is_ascii_digit()
            || matches!(byte, b'.' | b'_' | b':' | b'-')
    }) {
        return Err(format!(
            "{field_name} may only contain lowercase letters, numbers, ., _, :, and -"
        ));
    }
    Ok(value.to_owned())
}

fn required_text(
    request: &Map<String, Value>,
    key: &str,
    field_name: &str,
    max_len: usize,
) -> Result<String, String> {
    optional_text(request, key, field_name, max_len)?
        .ok_or_else(|| format!("{field_name} is required"))
}

fn optional_text(
    request: &Map<String, Value>,
    key: &str,
    field_name: &str,
    max_len: usize,
) -> Result<Option<String>, String> {
    let Some(value) = request.get(key) else {
        return Ok(None);
    };
    match value {
        Value::String(value) => {
            let value = value.trim();
            if value.is_empty() {
                return Ok(None);
            }
            if value.chars().count() > max_len {
                return Err(format!("{field_name} must be at most {max_len} characters"));
            }
            Ok(Some(value.to_owned()))
        }
        Value::Null => Ok(None),
        _ => Err(format!("{field_name} must be a string")),
    }
}

fn optional_bool(
    request: &Map<String, Value>,
    key: &str,
    field_name: &str,
) -> Result<Option<bool>, String> {
    let Some(value) = request.get(key) else {
        return Ok(None);
    };
    match value {
        Value::Bool(value) => Ok(Some(*value)),
        Value::Null => Ok(None),
        _ => Err(format!("{field_name} must be a boolean")),
    }
}

fn normalize_nullable_text_for_create(
    request: &Map<String, Value>,
    key: &str,
    field_name: &str,
    max_len: usize,
) -> Result<Option<String>, String> {
    match normalize_nullable_text_for_update(request, key, field_name, max_len)? {
        Some(value) => Ok(value),
        None => Ok(None),
    }
}

fn normalize_nullable_text_for_update(
    request: &Map<String, Value>,
    key: &str,
    field_name: &str,
    max_len: usize,
) -> Result<Option<Option<String>>, String> {
    let Some(value) = request.get(key) else {
        return Ok(None);
    };
    match value {
        Value::Null => Ok(Some(None)),
        Value::String(value) => {
            let value = value.trim();
            if value.is_empty() {
                return Ok(Some(None));
            }
            if value.chars().count() > max_len {
                return Err(format!("{field_name} must be at most {max_len} characters"));
            }
            if !value.bytes().all(|byte| (0x21..=0x7e).contains(&byte)) {
                return Err(format!(
                    "{field_name} must contain only visible ASCII characters"
                ));
            }
            Ok(Some(Some(value.to_owned())))
        }
        _ => Err(format!("{field_name} must be a string or null")),
    }
}

fn normalize_nullable_secret_ref_for_create(
    request: &Map<String, Value>,
    key: &str,
    field_name: &str,
) -> Result<Option<String>, String> {
    let value = normalize_nullable_text_for_create(request, key, field_name, MAX_REF_LEN)?;
    if let Some(value) = value.as_deref() {
        validate_secret_ref(value, field_name)?;
    }
    Ok(value)
}

fn normalize_nullable_secret_ref_for_update(
    request: &Map<String, Value>,
    key: &str,
    field_name: &str,
) -> Result<Option<Option<String>>, String> {
    let value = normalize_nullable_text_for_update(request, key, field_name, MAX_REF_LEN)?;
    if let Some(Some(value)) = value.as_ref() {
        validate_secret_ref(value, field_name)?;
    }
    Ok(value)
}

fn normalize_nullable_id_for_update(
    request: &Map<String, Value>,
    key: &str,
    field_name: &str,
) -> Result<Option<Option<i64>>, String> {
    let Some(value) = request.get(key) else {
        return Ok(None);
    };
    match value {
        Value::Null => Ok(Some(None)),
        Value::String(value) => parse_positive_id(value, field_name).map(Some).map(Some),
        Value::Number(value) => value
            .as_i64()
            .filter(|value| *value > 0)
            .ok_or_else(|| format!("{field_name} must be a positive integer"))
            .map(Some)
            .map(Some),
        _ => Err(format!("{field_name} must be a positive integer or null")),
    }
}

fn reject_plaintext_secret_values(request: &Map<String, Value>) -> Result<(), String> {
    for (key, value) in request {
        if !is_plaintext_secret_key(key) {
            continue;
        }
        let has_plaintext = match value {
            Value::String(value) => !value.trim().is_empty(),
            Value::Null => false,
            _ => true,
        };
        if has_plaintext {
            return Err(
                "plaintext open platform secrets are not accepted; submit only secretRef, tokenRef, and aesKeyRef"
                    .to_owned(),
            );
        }
    }
    Ok(())
}

fn is_plaintext_secret_key(key: &str) -> bool {
    let normalized = key
        .chars()
        .filter(|character| *character != '_' && *character != '-')
        .flat_map(char::to_lowercase)
        .collect::<String>();
    matches!(
        normalized.as_str(),
        "secret"
            | "appsecret"
            | "clientsecret"
            | "token"
            | "accesstoken"
            | "aeskey"
            | "encodingaeskey"
            | "privatekey"
    )
}

fn validate_secret_ref(value: &str, field_name: &str) -> Result<(), String> {
    let locator = if let Some(locator) = value.strip_prefix("vault://") {
        locator
    } else if let Some(locator) = value.strip_prefix("secret://") {
        locator
    } else {
        return Err(format!(
            "{field_name} must start with vault:// or secret://"
        ));
    };
    if locator.trim_matches('/').is_empty() {
        return Err(format!("{field_name} must include a non-empty locator"));
    }
    Ok(())
}

fn validate_entry_url(value: &str) -> Result<(), String> {
    if !value.bytes().all(|byte| (0x21..=0x7e).contains(&byte)) {
        return Err("entry url must contain only visible ASCII characters".to_owned());
    }
    let uri = value
        .parse::<Uri>()
        .map_err(|_| "entry url must be an absolute URL".to_owned())?;
    let Some(scheme) = uri.scheme_str() else {
        return Err("entry url must include a scheme".to_owned());
    };
    if !ENTRY_URL_SCHEMES.contains(&scheme) {
        return Err("entry url scheme is not supported".to_owned());
    }
    if matches!(scheme, "http" | "https") {
        if uri.authority().is_none() {
            return Err("entry url must be an absolute http or https URL".to_owned());
        }
        if uri
            .authority()
            .is_some_and(|authority| authority.as_str().contains('@'))
        {
            return Err("entry url must not contain user info".to_owned());
        }
    }
    Ok(())
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

fn build_create_account_command(
    state: AdminOpenPlatformState,
    headers: &HeaderMap,
    subject: AdminOpenPlatformSubject,
    request: NormalizedCreateAccountRequest,
) -> Result<CreateAdminOpenPlatformAccountCommand, OpenPlatformCommandBuildError> {
    Ok(CreateAdminOpenPlatformAccountCommand {
        subject,
        account_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        key: request.key,
        name: request.name,
        provider: request.provider,
        account_type: request.account_type,
        app_id: request.app_id,
        secret_ref: request.secret_ref,
        token_ref: request.token_ref,
        aes_key_ref: request.aes_key_ref,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_account_command(
    state: AdminOpenPlatformState,
    headers: &HeaderMap,
    subject: AdminOpenPlatformSubject,
    account_id: i64,
    request: NormalizedUpdateAccountRequest,
) -> Result<UpdateAdminOpenPlatformAccountCommand, OpenPlatformCommandBuildError> {
    Ok(UpdateAdminOpenPlatformAccountCommand {
        subject,
        account_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        name: request.name,
        app_id: request.app_id,
        secret_ref: request.secret_ref,
        token_ref: request.token_ref,
        aes_key_ref: request.aes_key_ref,
        default_entry_id: request.default_entry_id,
        qr_default: request.qr_default,
        status: request.status,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_delete_account_command(
    state: AdminOpenPlatformState,
    headers: &HeaderMap,
    subject: AdminOpenPlatformSubject,
    account_id: i64,
) -> Result<DeleteAdminOpenPlatformAccountCommand, OpenPlatformCommandBuildError> {
    Ok(DeleteAdminOpenPlatformAccountCommand {
        subject,
        account_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_create_entry_command(
    state: AdminOpenPlatformState,
    headers: &HeaderMap,
    subject: AdminOpenPlatformSubject,
    account_id: i64,
    request: NormalizedCreateEntryRequest,
) -> Result<CreateAdminOpenPlatformEntryCommand, OpenPlatformCommandBuildError> {
    Ok(CreateAdminOpenPlatformEntryCommand {
        subject,
        entry_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        account_id,
        key: request.key,
        entry_type: request.entry_type,
        url: request.url,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_entry_command(
    state: AdminOpenPlatformState,
    headers: &HeaderMap,
    subject: AdminOpenPlatformSubject,
    account_id: i64,
    entry_id: i64,
    request: NormalizedUpdateEntryRequest,
) -> Result<UpdateAdminOpenPlatformEntryCommand, OpenPlatformCommandBuildError> {
    Ok(UpdateAdminOpenPlatformEntryCommand {
        subject,
        account_id,
        entry_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        key: request.key,
        entry_type: request.entry_type,
        url: request.url,
        status: request.status,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_delete_entry_command(
    state: AdminOpenPlatformState,
    headers: &HeaderMap,
    subject: AdminOpenPlatformSubject,
    account_id: i64,
    entry_id: i64,
) -> Result<DeleteAdminOpenPlatformEntryCommand, OpenPlatformCommandBuildError> {
    Ok(DeleteAdminOpenPlatformEntryCommand {
        subject,
        account_id,
        entry_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_create_pay_binding_command(
    state: AdminOpenPlatformState,
    headers: &HeaderMap,
    subject: AdminOpenPlatformSubject,
    account_id: i64,
    request: NormalizedCreatePayBindingRequest,
) -> Result<CreateAdminOpenPlatformPayBindingCommand, OpenPlatformCommandBuildError> {
    Ok(CreateAdminOpenPlatformPayBindingCommand {
        subject,
        pay_binding_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        account_id,
        payment_account_id: request.payment_account_id,
        payment_channel_id: request.payment_channel_id,
        scene: request.scene,
        mode: request.mode,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_delete_pay_binding_command(
    state: AdminOpenPlatformState,
    headers: &HeaderMap,
    subject: AdminOpenPlatformSubject,
    account_id: i64,
    binding_id: i64,
) -> Result<DeleteAdminOpenPlatformPayBindingCommand, OpenPlatformCommandBuildError> {
    Ok(DeleteAdminOpenPlatformPayBindingCommand {
        subject,
        account_id,
        binding_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn generate_entity_uuid(
    state: &AdminOpenPlatformState,
) -> Result<String, OpenPlatformCommandBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(OpenPlatformCommandBuildError::System)
}

fn normalize_request_id(
    headers: &HeaderMap,
    state: &AdminOpenPlatformState,
) -> Result<String, OpenPlatformCommandBuildError> {
    if let Some(value) = header_value(headers, REQUEST_ID_HEADER) {
        if value.chars().count() > MAX_REQUEST_ID_LEN
            || !value.bytes().all(|byte| (0x21..=0x7e).contains(&byte))
        {
            return Err(OpenPlatformCommandBuildError::BadRequest(format!(
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

fn to_provider_response(
    item: AdminOpenPlatformProviderItem,
) -> AdminOpenPlatformProviderItemResponse {
    AdminOpenPlatformProviderItemResponse {
        id: item.id,
        provider: item.provider,
        name: item.name,
        status: item.status,
    }
}

fn to_manifest_response(
    item: AdminOpenPlatformManifestItem,
) -> AdminOpenPlatformManifestItemResponse {
    AdminOpenPlatformManifestItemResponse {
        id: item.id,
        key: item.key,
        provider: item.provider,
        account_type: item.account_type,
        version: item.version,
        status: item.status,
    }
}

fn to_account_response(item: AdminOpenPlatformAccountItem) -> AdminOpenPlatformAccountItemResponse {
    AdminOpenPlatformAccountItemResponse {
        id: item.id.to_string(),
        key: item.key,
        name: item.name,
        provider: item.provider,
        account_type: item.account_type,
        app_id: item.app_id,
        secret_ref: item.secret_ref,
        token_ref: item.token_ref,
        aes_key_ref: item.aes_key_ref,
        default_entry_id: item.default_entry_id.map(|id| id.to_string()),
        qr_default: item.qr_default,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
    }
}

fn to_entry_response(item: AdminOpenPlatformEntryItem) -> AdminOpenPlatformEntryItemResponse {
    AdminOpenPlatformEntryItemResponse {
        id: item.id.to_string(),
        account_id: item.account_id.to_string(),
        key: item.key,
        entry_type: item.entry_type,
        url: item.url,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
    }
}

fn to_pay_binding_response(
    item: AdminOpenPlatformPayBindingItem,
) -> AdminOpenPlatformPayBindingItemResponse {
    AdminOpenPlatformPayBindingItemResponse {
        id: item.id.to_string(),
        account_id: item.account_id.to_string(),
        payment_account_id: item.payment_account_id,
        payment_channel_id: item.payment_channel_id,
        scene: item.scene,
        mode: item.mode,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
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

fn command_build_error_response(error: OpenPlatformCommandBuildError) -> Response {
    match error {
        OpenPlatformCommandBuildError::BadRequest(message) => bad_request(message),
        OpenPlatformCommandBuildError::System(error) => {
            open_platform_system_response("open platform command is invalid", error)
        }
    }
}

fn open_platform_system_response(context: &str, error: DomainError) -> Response {
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
