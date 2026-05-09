use std::net::IpAddr;
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::{Deserialize, Serialize};

use crate::api::response::PlusApiResult;
use crate::application::{ApiKeySecretGenerator, ApiKeySecretHasher};
use crate::domain::{
    ApiKeyGroup, ApiKeyGroupMetricSnapshot, DecimalValue, DomainError, GatewayAccessPolicy,
    GatewayApiKey, QuotaPolicy,
};
use crate::ports::{
    CreateGatewayApiKeyCommand, GatewayApiKeyCommandStore, GatewayApiKeyManagementReadStore,
    GatewayApiKeyManagementSnapshot, PricingCatalog,
};

const UNRESTRICTED_MODALITIES: [&str; 5] = ["text", "image", "video", "audio", "music"];
const HASH_ALG_HMAC_SHA256: &str = "HMAC_SHA256";
const SECRET_VERSION: i64 = 1;
const IDEMPOTENCY_KEY_HEADER: &str = "Idempotency-Key";
const REQUEST_ID_HEADER: &str = "X-Request-Id";

struct ReadOnlyAppApiKeyState<C> {
    catalog: Arc<C>,
}

impl<C> Clone for ReadOnlyAppApiKeyState<C> {
    fn clone(&self) -> Self {
        Self {
            catalog: Arc::clone(&self.catalog),
        }
    }
}

struct AppApiKeyState {
    read_store: Arc<dyn GatewayApiKeyManagementReadStore + Send + Sync>,
    command_store: Arc<dyn GatewayApiKeyCommandStore + Send + Sync>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    secret_generator: Arc<dyn ApiKeySecretGenerator + Send + Sync>,
}

impl Clone for AppApiKeyState {
    fn clone(&self) -> Self {
        Self {
            read_store: Arc::clone(&self.read_store),
            command_store: Arc::clone(&self.command_store),
            api_key_hasher: Arc::clone(&self.api_key_hasher),
            secret_generator: Arc::clone(&self.secret_generator),
        }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppApiKeyListResponse {
    items: Vec<AppApiKeyItemResponse>,
    groups: Vec<AppApiKeyGroupResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppApiKeyCreateResponse {
    item: AppApiKeyItemResponse,
    raw_key: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppApiKeyItemResponse {
    id: String,
    name: String,
    masked_key: String,
    group: String,
    rate: Option<String>,
    quota: String,
    used_quota: String,
    modalities: Vec<String>,
    ip_limit: String,
    created: String,
    expires: String,
    status: &'static str,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppApiKeyGroupResponse {
    id: String,
    code: String,
    name: String,
    rate: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppApiKeyCreateRequest {
    name: Option<String>,
    group: Option<String>,
    group_id: Option<i64>,
    quota: Option<String>,
    is_unlimited_quota: Option<bool>,
    modalities: Option<Vec<String>>,
    ip_limit: Option<String>,
    expires: Option<String>,
}

pub fn app_api_key_router<C>(catalog: Arc<C>) -> Router
where
    C: PricingCatalog + Send + Sync + 'static,
{
    Router::new()
        .route("/app/v3/api/router/api-keys", get(fetch_catalog_keys::<C>))
        .with_state(ReadOnlyAppApiKeyState { catalog })
}

pub fn app_api_key_router_with_read_store_and_command_store(
    read_store: Arc<dyn GatewayApiKeyManagementReadStore + Send + Sync>,
    command_store: Arc<dyn GatewayApiKeyCommandStore + Send + Sync>,
    api_key_hasher: Arc<dyn ApiKeySecretHasher + Send + Sync>,
    secret_generator: Arc<dyn ApiKeySecretGenerator + Send + Sync>,
) -> Router {
    Router::new()
        .route(
            "/app/v3/api/router/api-keys",
            get(fetch_keys).post(create_key),
        )
        .with_state(AppApiKeyState {
            read_store,
            command_store,
            api_key_hasher,
            secret_generator,
        })
}

async fn fetch_catalog_keys<C>(State(state): State<ReadOnlyAppApiKeyState<C>>) -> impl IntoResponse
where
    C: PricingCatalog + Send + Sync + 'static,
{
    let snapshot = GatewayApiKeyManagementSnapshot::from_pricing_catalog(state.catalog.as_ref());
    Json(PlusApiResult::success(list_response(&snapshot)))
}

async fn fetch_keys(State(state): State<AppApiKeyState>, headers: HeaderMap) -> Response {
    let subject = match TrustedRequestSubject::from_headers(&headers) {
        Ok(subject) => subject,
        Err(error) => {
            return (
                StatusCode::UNAUTHORIZED,
                Json(PlusApiResult::error("4010", error.to_string())),
            )
                .into_response()
        }
    };

    match state
        .read_store
        .load_gateway_api_key_management_snapshot()
        .await
    {
        Ok(snapshot) => {
            let scoped_snapshot =
                snapshot.for_subject(subject.tenant_id, subject.organization_id, subject.user_id);
            Json(PlusApiResult::success(list_response(&scoped_snapshot))).into_response()
        }
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(PlusApiResult::error(
                "5000",
                format!("api key read model is unavailable: {error}"),
            )),
        )
            .into_response(),
    }
}

async fn create_key(
    State(state): State<AppApiKeyState>,
    headers: HeaderMap,
    Json(request): Json<AppApiKeyCreateRequest>,
) -> Response {
    match create_key_inner(state, headers, request).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(AppApiKeyCreateError::Unauthorized(message)) => (
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", message)),
        )
            .into_response(),
        Err(AppApiKeyCreateError::BadRequest(message)) => (
            StatusCode::BAD_REQUEST,
            Json(PlusApiResult::error("4001", message)),
        )
            .into_response(),
        Err(AppApiKeyCreateError::System(message)) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(PlusApiResult::error("5000", message)),
        )
            .into_response(),
        Err(AppApiKeyCreateError::Conflict(message)) => (
            StatusCode::CONFLICT,
            Json(PlusApiResult::error("4090", message)),
        )
            .into_response(),
    }
}

async fn create_key_inner(
    state: AppApiKeyState,
    headers: HeaderMap,
    request: AppApiKeyCreateRequest,
) -> Result<AppApiKeyCreateResponse, AppApiKeyCreateError> {
    let subject = TrustedRequestSubject::from_headers(&headers).map_err(unauthorized_error)?;
    let snapshot = state
        .read_store
        .load_gateway_api_key_management_snapshot()
        .await
        .map_err(system_error)?;
    let group = resolve_group(&snapshot, &request)?;
    let name = normalize_name(request.name.as_deref())?;
    let quota_limit = normalize_quota_limit(&request)?;
    let requested_modalities = normalize_modalities(request.modalities)?;
    let allowed_capabilities = restricted_modalities(&requested_modalities);
    let ip_allowlist = normalize_ip_allowlist(request.ip_limit.as_deref())?;
    let expire_at = normalize_expire_at(request.expires.as_deref())?;
    let idempotency_key = normalize_idempotency_key(&headers)?;
    let request_id = normalize_request_id(&headers, &state)?;
    let raw_key = state
        .secret_generator
        .generate_api_key_secret()
        .map_err(system_error)?;
    let key_hash = state
        .api_key_hasher
        .hash_secret(&raw_key)
        .map_err(system_error)?;
    let command = CreateGatewayApiKeyCommand {
        api_key_uuid: state
            .secret_generator
            .generate_entity_uuid()
            .map_err(system_error)?,
        access_policy_uuid: state
            .secret_generator
            .generate_entity_uuid()
            .map_err(system_error)?,
        quota_policy_uuid: state
            .secret_generator
            .generate_entity_uuid()
            .map_err(system_error)?,
        audit_log_uuid: state
            .secret_generator
            .generate_entity_uuid()
            .map_err(system_error)?,
        tenant_id: subject.tenant_id,
        organization_id: subject.organization_id,
        user_id: subject.user_id,
        operator_id: subject.operator_id,
        operator_type: subject.operator_type,
        name,
        group_id: group.id,
        key_prefix: key_prefix(&raw_key),
        key_display_masked: mask_created_key(&raw_key),
        key_hash,
        hash_alg: HASH_ALG_HMAC_SHA256.to_owned(),
        secret_version: SECRET_VERSION,
        request_id,
        idempotency_key,
        created_at: current_timestamp_string(),
        expire_at,
        allowed_capabilities,
        ip_allowlist,
        quota_limit,
    };

    let created = state
        .command_store
        .create_gateway_api_key(command)
        .await
        .map_err(store_error)?;

    let response_snapshot = snapshot.with_created_api_key(
        created.api_key.clone(),
        created.access_policy,
        created.quota_policy,
    );
    let item = to_created_item_response(&response_snapshot, created.api_key);

    Ok(AppApiKeyCreateResponse { item, raw_key })
}

fn list_response(snapshot: &GatewayApiKeyManagementSnapshot) -> AppApiKeyListResponse {
    let items = snapshot
        .api_keys
        .clone()
        .into_iter()
        .map(|api_key| to_item_response(snapshot, api_key))
        .collect();
    let groups = snapshot
        .api_key_groups
        .clone()
        .into_iter()
        .map(to_group_response)
        .collect();

    AppApiKeyListResponse { items, groups }
}

fn to_item_response(
    snapshot: &GatewayApiKeyManagementSnapshot,
    api_key: GatewayApiKey,
) -> AppApiKeyItemResponse {
    to_item_response_with_used_quota(snapshot, api_key, None)
}

fn to_created_item_response(
    snapshot: &GatewayApiKeyManagementSnapshot,
    api_key: GatewayApiKey,
) -> AppApiKeyItemResponse {
    to_item_response_with_used_quota(snapshot, api_key, Some("0.000000".to_owned()))
}

fn to_item_response_with_used_quota(
    snapshot: &GatewayApiKeyManagementSnapshot,
    api_key: GatewayApiKey,
    used_quota_override: Option<String>,
) -> AppApiKeyItemResponse {
    let group = snapshot.find_api_key_group(api_key.group_id);
    let access_policy = api_key
        .policy_id
        .and_then(|policy_id| snapshot.find_access_policy(policy_id));
    let quota_policy = api_key
        .quota_policy_id
        .and_then(|policy_id| snapshot.find_quota_policy(policy_id));
    let metric_snapshot = snapshot.find_latest_api_key_group_metric_snapshot(api_key.group_id);
    let masked_key = api_key.masked_key();

    AppApiKeyItemResponse {
        id: api_key.id.to_string(),
        name: api_key.display_name(),
        masked_key,
        group: group_code(group.as_ref()),
        rate: group_rate(group.as_ref()),
        quota: quota_limit(quota_policy.as_ref(), metric_snapshot.as_ref()),
        used_quota: used_quota_override.unwrap_or_else(|| used_quota(metric_snapshot.as_ref())),
        modalities: modalities(access_policy.as_ref()),
        ip_limit: ip_limit(access_policy.as_ref()),
        created: api_key.created_at.clone(),
        expires: api_key
            .expire_at
            .clone()
            .unwrap_or_else(|| "never".to_owned()),
        status: api_key.status_label(),
    }
}

fn to_group_response(group: ApiKeyGroup) -> AppApiKeyGroupResponse {
    AppApiKeyGroupResponse {
        id: group.id.to_string(),
        name: group.code.clone(),
        code: group.code,
        rate: Some(format!("{}x", group.rate_multiplier.to_fixed_string(2))),
    }
}

fn group_code(group: Option<&ApiKeyGroup>) -> String {
    group
        .map(|group| group.code.clone())
        .unwrap_or_else(|| "unassigned".to_owned())
}

fn group_rate(group: Option<&ApiKeyGroup>) -> Option<String> {
    group.map(|group| format!("{}x", group.rate_multiplier.to_fixed_string(2)))
}

fn quota_limit(
    quota_policy: Option<&QuotaPolicy>,
    metric_snapshot: Option<&ApiKeyGroupMetricSnapshot>,
) -> String {
    quota_policy
        .and_then(|policy| policy.quota_limit)
        .or_else(|| metric_snapshot.and_then(|snapshot| snapshot.capacity_limit))
        .map(|quota| quota.to_fixed_string(6))
        .unwrap_or_else(|| "unlimited".to_owned())
}

fn used_quota(metric_snapshot: Option<&ApiKeyGroupMetricSnapshot>) -> String {
    metric_snapshot
        .and_then(|snapshot| snapshot.usage_amount_total.or(snapshot.capacity_used))
        .map(|quota| quota.to_fixed_string(6))
        .unwrap_or_else(|| "0.000000".to_owned())
}

fn modalities(policy: Option<&GatewayAccessPolicy>) -> Vec<String> {
    let Some(policy) = policy else {
        return unrestricted_modalities();
    };
    if policy.allowed_capabilities.is_empty() {
        return unrestricted_modalities();
    }
    policy.allowed_capabilities.clone()
}

fn ip_limit(policy: Option<&GatewayAccessPolicy>) -> String {
    let Some(policy) = policy else {
        return "unrestricted".to_owned();
    };
    if policy.ip_allowlist.is_empty() {
        "unrestricted".to_owned()
    } else {
        policy.ip_allowlist.join(", ")
    }
}

fn unrestricted_modalities() -> Vec<String> {
    UNRESTRICTED_MODALITIES
        .iter()
        .map(|modality| (*modality).to_owned())
        .collect()
}

fn resolve_group(
    snapshot: &GatewayApiKeyManagementSnapshot,
    request: &AppApiKeyCreateRequest,
) -> Result<ApiKeyGroup, AppApiKeyCreateError> {
    if let Some(group_id) = request.group_id {
        return snapshot.find_api_key_group(group_id).ok_or_else(|| {
            AppApiKeyCreateError::BadRequest("api key group is not available".to_owned())
        });
    }

    let groups = snapshot.api_key_groups.clone();
    if let Some(group_code) = request
        .group
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
    {
        return groups
            .into_iter()
            .find(|group| group.code == group_code)
            .ok_or_else(|| {
                AppApiKeyCreateError::BadRequest("api key group is not available".to_owned())
            });
    }

    if groups.len() == 1 {
        Ok(groups[0].clone())
    } else {
        Err(AppApiKeyCreateError::BadRequest(
            "api key group is required".to_owned(),
        ))
    }
}

fn normalize_name(value: Option<&str>) -> Result<String, AppApiKeyCreateError> {
    let name = value.unwrap_or("").trim();
    if name.is_empty() {
        return Err(AppApiKeyCreateError::BadRequest(
            "api key name is required".to_owned(),
        ));
    }
    if name.chars().count() > 128 {
        return Err(AppApiKeyCreateError::BadRequest(
            "api key name must be at most 128 characters".to_owned(),
        ));
    }
    Ok(name.to_owned())
}

fn normalize_idempotency_key(headers: &HeaderMap) -> Result<String, AppApiKeyCreateError> {
    let value = header_value(headers, IDEMPOTENCY_KEY_HEADER).ok_or_else(|| {
        AppApiKeyCreateError::BadRequest("Idempotency-Key header is required".to_owned())
    })?;
    validate_request_token(value, "Idempotency-Key")
}

fn normalize_request_id(
    headers: &HeaderMap,
    state: &AppApiKeyState,
) -> Result<String, AppApiKeyCreateError> {
    if let Some(value) = header_value(headers, REQUEST_ID_HEADER) {
        return validate_request_token(value, "X-Request-Id");
    }
    state
        .secret_generator
        .generate_entity_uuid()
        .map_err(system_error)
}

fn header_value<'a>(headers: &'a HeaderMap, name: &str) -> Option<&'a str> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| !value.is_empty())
}

fn validate_request_token(value: &str, field: &str) -> Result<String, AppApiKeyCreateError> {
    if value.chars().count() > 128 {
        return Err(AppApiKeyCreateError::BadRequest(format!(
            "{field} must be at most 128 characters"
        )));
    }
    if !value.bytes().all(|byte| (0x21..=0x7e).contains(&byte)) {
        return Err(AppApiKeyCreateError::BadRequest(format!(
            "{field} must contain only visible ASCII characters"
        )));
    }
    Ok(value.to_owned())
}

fn normalize_modalities(value: Option<Vec<String>>) -> Result<Vec<String>, AppApiKeyCreateError> {
    let requested = value.unwrap_or_else(unrestricted_modalities);
    let mut modalities = Vec::new();
    for item in requested {
        let item = item.trim().to_ascii_lowercase();
        if item.is_empty() {
            continue;
        }
        if !UNRESTRICTED_MODALITIES.contains(&item.as_str()) {
            return Err(AppApiKeyCreateError::BadRequest(format!(
                "unsupported api key modality: {item}"
            )));
        }
        if !modalities.contains(&item) {
            modalities.push(item);
        }
    }
    if modalities.is_empty() {
        return Err(AppApiKeyCreateError::BadRequest(
            "at least one api key modality is required".to_owned(),
        ));
    }
    Ok(modalities)
}

fn restricted_modalities(modalities: &[String]) -> Vec<String> {
    let unrestricted = unrestricted_modalities();
    if modalities == unrestricted.as_slice() {
        Vec::new()
    } else {
        modalities.to_vec()
    }
}

fn normalize_ip_allowlist(value: Option<&str>) -> Result<Vec<String>, AppApiKeyCreateError> {
    let Some(value) = value.map(str::trim).filter(|value| !value.is_empty()) else {
        return Ok(Vec::new());
    };
    if value.eq_ignore_ascii_case("unrestricted") {
        return Ok(Vec::new());
    }

    let mut items = Vec::new();
    for item in value.split(',') {
        let item = item.trim();
        if item.is_empty() {
            continue;
        }
        if item.chars().count() > 64 {
            return Err(AppApiKeyCreateError::BadRequest(
                "ip allowlist entry must be at most 64 characters".to_owned(),
            ));
        }
        let normalized = normalize_ip_allowlist_entry(item)?;
        if !items.contains(&normalized) {
            items.push(normalized);
        }
    }
    Ok(items)
}

fn normalize_ip_allowlist_entry(value: &str) -> Result<String, AppApiKeyCreateError> {
    if value.matches('/').count() > 1 {
        return Err(AppApiKeyCreateError::BadRequest(format!(
            "invalid ip allowlist entry: {value}"
        )));
    }

    if let Some((address, prefix)) = value.split_once('/') {
        let address = parse_ip_address(address, value)?;
        let prefix = parse_cidr_prefix(prefix, address, value)?;
        return Ok(format!("{address}/{prefix}"));
    }

    parse_ip_address(value, value).map(|address| address.to_string())
}

fn parse_ip_address(value: &str, original: &str) -> Result<IpAddr, AppApiKeyCreateError> {
    value.parse::<IpAddr>().map_err(|_| {
        AppApiKeyCreateError::BadRequest(format!("invalid ip allowlist entry: {original}"))
    })
}

fn parse_cidr_prefix(
    value: &str,
    address: IpAddr,
    original: &str,
) -> Result<u8, AppApiKeyCreateError> {
    if value.is_empty() || !value.chars().all(|ch| ch.is_ascii_digit()) {
        return Err(AppApiKeyCreateError::BadRequest(format!(
            "invalid ip allowlist entry: {original}"
        )));
    }
    let prefix = value.parse::<u8>().map_err(|_| {
        AppApiKeyCreateError::BadRequest(format!("invalid ip allowlist entry: {original}"))
    })?;
    let max_prefix = match address {
        IpAddr::V4(_) => 32,
        IpAddr::V6(_) => 128,
    };
    if prefix > max_prefix {
        return Err(AppApiKeyCreateError::BadRequest(format!(
            "invalid ip allowlist entry: {original}"
        )));
    }
    Ok(prefix)
}

fn normalize_quota_limit(
    request: &AppApiKeyCreateRequest,
) -> Result<Option<DecimalValue>, AppApiKeyCreateError> {
    if request.is_unlimited_quota.unwrap_or(false) {
        return Ok(None);
    }
    let Some(quota) = request
        .quota
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
    else {
        return Ok(None);
    };
    let quota = DecimalValue::parse(quota)
        .map_err(|error| AppApiKeyCreateError::BadRequest(error.to_string()))?;
    if quota <= DecimalValue::ZERO {
        return Err(AppApiKeyCreateError::BadRequest(
            "api key quota must be greater than zero".to_owned(),
        ));
    }
    Ok(Some(quota))
}

fn normalize_expire_at(value: Option<&str>) -> Result<Option<String>, AppApiKeyCreateError> {
    let Some(value) = value.map(str::trim).filter(|value| !value.is_empty()) else {
        return Ok(None);
    };
    if value.eq_ignore_ascii_case("never") {
        return Ok(None);
    }
    let normalized = value.replace('T', " ");
    let normalized = match normalized.len() {
        16 => format!("{normalized}:00"),
        19 => normalized,
        _ => {
            return Err(AppApiKeyCreateError::BadRequest(
                "api key expiration must use YYYY-MM-DDTHH:mm format".to_owned(),
            ))
        }
    };
    validate_timestamp(&normalized)?;
    Ok(Some(normalized))
}

fn validate_timestamp(value: &str) -> Result<(), AppApiKeyCreateError> {
    if value.len() != 19 {
        return invalid_timestamp();
    }
    let bytes = value.as_bytes();
    if bytes[4] != b'-'
        || bytes[7] != b'-'
        || bytes[10] != b' '
        || bytes[13] != b':'
        || bytes[16] != b':'
    {
        return invalid_timestamp();
    }
    let year = parse_timestamp_number(&value[0..4])?;
    let month = parse_timestamp_number(&value[5..7])?;
    let day = parse_timestamp_number(&value[8..10])?;
    let hour = parse_timestamp_number(&value[11..13])?;
    let minute = parse_timestamp_number(&value[14..16])?;
    let second = parse_timestamp_number(&value[17..19])?;

    if year < 1970
        || !(1..=12).contains(&month)
        || day < 1
        || day > days_in_month(year, month)
        || hour > 23
        || minute > 59
        || second > 59
    {
        return invalid_timestamp();
    }

    Ok(())
}

fn parse_timestamp_number(value: &str) -> Result<i64, AppApiKeyCreateError> {
    if !value.chars().all(|ch| ch.is_ascii_digit()) {
        return invalid_timestamp();
    }
    value.parse::<i64>().map_err(|_| {
        AppApiKeyCreateError::BadRequest("api key expiration must be a valid timestamp".to_owned())
    })
}

fn invalid_timestamp<T>() -> Result<T, AppApiKeyCreateError> {
    Err(AppApiKeyCreateError::BadRequest(
        "api key expiration must be a valid timestamp".to_owned(),
    ))
}

fn days_in_month(year: i64, month: i64) -> i64 {
    match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 if is_leap_year(year) => 29,
        2 => 28,
        _ => 0,
    }
}

fn is_leap_year(year: i64) -> bool {
    (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
}

fn key_prefix(raw_key: &str) -> String {
    raw_key.chars().take(16).collect()
}

fn mask_created_key(raw_key: &str) -> String {
    let prefix: String = raw_key.chars().take(16).collect();
    let mut suffix_chars: Vec<char> = raw_key.chars().rev().take(4).collect();
    suffix_chars.reverse();
    let suffix: String = suffix_chars.into_iter().collect();
    format!("{prefix}********{suffix}")
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

fn system_error(error: DomainError) -> AppApiKeyCreateError {
    AppApiKeyCreateError::System(error.to_string())
}

fn unauthorized_error(error: impl std::fmt::Display) -> AppApiKeyCreateError {
    AppApiKeyCreateError::Unauthorized(error.to_string())
}

fn store_error(error: DomainError) -> AppApiKeyCreateError {
    if error.is_conflict() {
        AppApiKeyCreateError::Conflict(error.to_string())
    } else {
        AppApiKeyCreateError::System(error.to_string())
    }
}

#[derive(Debug)]
enum AppApiKeyCreateError {
    Unauthorized(String),
    BadRequest(String),
    Conflict(String),
    System(String),
}
