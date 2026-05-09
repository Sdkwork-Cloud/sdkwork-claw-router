use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Bytes;
use axum::extract::{Path, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, get, patch, post};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::ports::{
    AdminCouponBatchItem, AdminMarketingStore, AdminMarketingSubject, AdminPromoCodeItem,
    CreateAdminCouponCommand, DeleteAdminCouponCommand, GenerateAdminCouponBatchCommand,
    ListAdminCouponBatchesQuery, ListAdminCouponsQuery, ListAdminPromoCodesQuery,
    ListAdminRechargeRecordsQuery, ListAdminRedemptionRecordsQuery, ListAdminReferralStatsQuery,
    UpdateAdminPromoCodeStatusCommand,
};

const REQUEST_ID_HEADER: &str = "X-Request-Id";
const MAX_NAME_LEN: usize = 128;
const MAX_PREFIX_LEN: usize = 32;
const MAX_REQUEST_ID_LEN: usize = 128;
const MAX_BATCH_COUNT: i64 = 10_000;

#[derive(Clone)]
struct AdminMarketingState {
    store: Arc<dyn AdminMarketingStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminMarketingListResponse<T> {
    items: Vec<T>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminMarketingItemEnvelope<T> {
    item: T,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminMarketingDeleteResponse {
    deleted: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminMarketingUpdateResponse {
    updated: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminCouponBatchGenerateResponse {
    batch: AdminCouponBatchItem,
    codes: Vec<AdminPromoCodeItem>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateCouponRequest {
    name: Option<String>,
    #[serde(rename = "type")]
    coupon_type: Option<String>,
    value: Option<Value>,
    status: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct GenerateBatchRequest {
    coupon_id: Option<Value>,
    name: Option<String>,
    count: Option<i64>,
    prefix: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdatePromoCodeStatusRequest {
    status: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct NormalizedCouponValue {
    value: String,
    amount_cents: i64,
    discount_value: Option<String>,
}

enum AdminMarketingCommandBuildError {
    BadRequest(String),
    System(DomainError),
}

pub fn admin_marketing_router_with_store(
    store: Arc<dyn AdminMarketingStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    Router::new()
        .route("/backend/v3/api/coupon/list", post(fetch_coupons))
        .route("/backend/v3/api/coupon", post(create_coupon))
        .route("/backend/v3/api/coupon/{coupon_id}", delete(delete_coupon))
        .route("/backend/v3/api/router/coupon-batches", get(fetch_batches))
        .route(
            "/backend/v3/api/router/coupon-batches/generate",
            post(generate_batch),
        )
        .route(
            "/backend/v3/api/router/coupon-codes",
            get(fetch_promo_codes),
        )
        .route(
            "/backend/v3/api/router/coupon-codes/{promo_code_id}/status",
            patch(update_promo_code_status),
        )
        .route(
            "/backend/v3/api/user/coupon/list",
            post(fetch_redemption_records),
        )
        .route(
            "/backend/v3/api/vip/recharge/list",
            post(fetch_recharge_records),
        )
        .route(
            "/backend/v3/api/router/referrals/stats",
            get(fetch_referral_stats),
        )
        .with_state(AdminMarketingState {
            store,
            entity_uuid_generator,
        })
}

async fn fetch_coupons(State(state): State<AdminMarketingState>, headers: HeaderMap) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .store
        .list_coupons(ListAdminCouponsQuery { subject })
        .await
    {
        Ok(items) => list_response(items),
        Err(error) => marketing_system_response("coupon read model is unavailable", error),
    }
}

async fn create_coupon(
    State(state): State<AdminMarketingState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<CreateCouponRequest>(&body, "coupon") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_create_coupon_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.create_coupon(command).await {
        Ok(item) => {
            Json(PlusApiResult::success(AdminMarketingItemEnvelope { item })).into_response()
        }
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => marketing_system_response("coupon command store is unavailable", error),
    }
}

async fn delete_coupon(
    State(state): State<AdminMarketingState>,
    headers: HeaderMap,
    Path(coupon_id): Path<String>,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let coupon_id = match parse_positive_id(&coupon_id, "coupon id") {
        Ok(coupon_id) => coupon_id,
        Err(message) => return bad_request(message),
    };
    let command = match build_delete_coupon_command(state.clone(), &headers, subject, coupon_id) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.delete_coupon(command).await {
        Ok(true) => Json(PlusApiResult::success(AdminMarketingDeleteResponse {
            deleted: true,
        }))
        .into_response(),
        Ok(false) => not_found_response("coupon was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => marketing_system_response("coupon command store is unavailable", error),
    }
}

async fn fetch_batches(State(state): State<AdminMarketingState>, headers: HeaderMap) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .store
        .list_batches(ListAdminCouponBatchesQuery { subject })
        .await
    {
        Ok(items) => list_response(items),
        Err(error) => marketing_system_response("coupon batch read model is unavailable", error),
    }
}

async fn generate_batch(
    State(state): State<AdminMarketingState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<GenerateBatchRequest>(&body, "coupon batch") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_generate_batch_command(state.clone(), &headers, subject, request) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.generate_batch(command).await {
        Ok((batch, codes)) => Json(PlusApiResult::success(AdminCouponBatchGenerateResponse {
            batch,
            codes,
        }))
        .into_response(),
        Err(error) if error.is_not_found() => not_found_response("coupon was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => marketing_system_response("coupon batch command store is unavailable", error),
    }
}

async fn fetch_promo_codes(
    State(state): State<AdminMarketingState>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .store
        .list_promo_codes(ListAdminPromoCodesQuery { subject })
        .await
    {
        Ok(items) => list_response(items),
        Err(error) => marketing_system_response("promo code read model is unavailable", error),
    }
}

async fn update_promo_code_status(
    State(state): State<AdminMarketingState>,
    headers: HeaderMap,
    Path(promo_code_id): Path<String>,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let promo_code_id = match parse_positive_id(&promo_code_id, "promo code id") {
        Ok(promo_code_id) => promo_code_id,
        Err(message) => return bad_request(message),
    };
    let request = match parse_json_body::<UpdatePromoCodeStatusRequest>(&body, "promo code status")
    {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let command = match build_update_promo_code_status_command(
        state.clone(),
        &headers,
        subject,
        promo_code_id,
        request,
    ) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.update_promo_code_status(command).await {
        Ok(true) => Json(PlusApiResult::success(AdminMarketingUpdateResponse {
            updated: true,
        }))
        .into_response(),
        Ok(false) => not_found_response("promo code was not found"),
        Err(error) if error.is_conflict() => conflict_response(error),
        Err(error) => marketing_system_response("promo code command store is unavailable", error),
    }
}

async fn fetch_redemption_records(
    State(state): State<AdminMarketingState>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .store
        .list_redemption_records(ListAdminRedemptionRecordsQuery { subject })
        .await
    {
        Ok(items) => list_response(items),
        Err(error) => marketing_system_response("redemption read model is unavailable", error),
    }
}

async fn fetch_recharge_records(
    State(state): State<AdminMarketingState>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .store
        .list_recharge_records(ListAdminRechargeRecordsQuery { subject })
        .await
    {
        Ok(items) => list_response(items),
        Err(error) => marketing_system_response("recharge read model is unavailable", error),
    }
}

async fn fetch_referral_stats(
    State(state): State<AdminMarketingState>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .store
        .list_referral_stats(ListAdminReferralStatsQuery { subject })
        .await
    {
        Ok(items) => list_response(items),
        Err(error) => marketing_system_response("referral read model is unavailable", error),
    }
}

fn list_response<T>(items: Vec<T>) -> Response
where
    T: Serialize,
{
    Json(PlusApiResult::success(AdminMarketingListResponse { items })).into_response()
}

fn resolve_subject(headers: &HeaderMap) -> Result<AdminMarketingSubject, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| AdminMarketingSubject {
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

fn build_create_coupon_command(
    state: AdminMarketingState,
    headers: &HeaderMap,
    subject: AdminMarketingSubject,
    request: CreateCouponRequest,
) -> Result<CreateAdminCouponCommand, AdminMarketingCommandBuildError> {
    let name = normalize_required_text(request.name.as_deref(), "coupon name", MAX_NAME_LEN)?;
    let coupon_type = normalize_coupon_type(request.coupon_type.as_deref())?;
    let value = normalize_coupon_value(request.value.as_ref(), &coupon_type)?;
    let status = normalize_coupon_status(request.status.as_deref())?;
    Ok(CreateAdminCouponCommand {
        subject,
        coupon_uuid: generate_entity_uuid(&state)?,
        template_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        name,
        coupon_type,
        value: value.value,
        amount_cents: value.amount_cents,
        discount_value: value.discount_value,
        status,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_delete_coupon_command(
    state: AdminMarketingState,
    headers: &HeaderMap,
    subject: AdminMarketingSubject,
    coupon_id: i64,
) -> Result<DeleteAdminCouponCommand, AdminMarketingCommandBuildError> {
    Ok(DeleteAdminCouponCommand {
        subject,
        coupon_id,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_generate_batch_command(
    state: AdminMarketingState,
    headers: &HeaderMap,
    subject: AdminMarketingSubject,
    request: GenerateBatchRequest,
) -> Result<GenerateAdminCouponBatchCommand, AdminMarketingCommandBuildError> {
    let coupon_id = normalize_id_value(request.coupon_id.as_ref(), "couponId")?;
    let name = normalize_required_text(request.name.as_deref(), "batch name", MAX_NAME_LEN)?;
    let count = normalize_batch_count(request.count)?;
    let prefix = normalize_code_prefix(request.prefix.as_deref())?;
    Ok(GenerateAdminCouponBatchCommand {
        subject,
        batch_uuid: generate_entity_uuid(&state)?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        coupon_id,
        name,
        count,
        prefix,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn build_update_promo_code_status_command(
    state: AdminMarketingState,
    headers: &HeaderMap,
    subject: AdminMarketingSubject,
    promo_code_id: i64,
    request: UpdatePromoCodeStatusRequest,
) -> Result<UpdateAdminPromoCodeStatusCommand, AdminMarketingCommandBuildError> {
    Ok(UpdateAdminPromoCodeStatusCommand {
        subject,
        promo_code_id,
        status: normalize_promo_code_status(request.status.as_deref())?,
        audit_log_uuid: generate_entity_uuid(&state)?,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn normalize_required_text(
    value: Option<&str>,
    field_name: &str,
    max_len: usize,
) -> Result<String, AdminMarketingCommandBuildError> {
    let value = value.unwrap_or("").trim();
    if value.is_empty() {
        return Err(AdminMarketingCommandBuildError::BadRequest(format!(
            "{field_name} is required"
        )));
    }
    if value.chars().count() > max_len {
        return Err(AdminMarketingCommandBuildError::BadRequest(format!(
            "{field_name} must be at most {max_len} characters"
        )));
    }
    Ok(value.to_owned())
}

fn normalize_coupon_type(value: Option<&str>) -> Result<String, AdminMarketingCommandBuildError> {
    match value
        .unwrap_or("amount")
        .trim()
        .to_ascii_lowercase()
        .as_str()
    {
        "amount" | "fixed" | "cash" => Ok("amount".to_owned()),
        "discount" | "percent" | "percentage" => Ok("discount".to_owned()),
        _ => Err(AdminMarketingCommandBuildError::BadRequest(
            "coupon type must be amount or discount".to_owned(),
        )),
    }
}

fn normalize_coupon_status(value: Option<&str>) -> Result<String, AdminMarketingCommandBuildError> {
    match value
        .unwrap_or("active")
        .trim()
        .to_ascii_lowercase()
        .as_str()
    {
        "active" | "enabled" | "normal" => Ok("active".to_owned()),
        "inactive" | "disabled" => Ok("inactive".to_owned()),
        _ => Err(AdminMarketingCommandBuildError::BadRequest(
            "coupon status must be active or inactive".to_owned(),
        )),
    }
}

fn normalize_coupon_value(
    value: Option<&Value>,
    coupon_type: &str,
) -> Result<NormalizedCouponValue, AdminMarketingCommandBuildError> {
    let raw = match value {
        Some(Value::String(value)) => value.trim().to_owned(),
        Some(Value::Number(value)) => value.to_string(),
        Some(_) => {
            return Err(AdminMarketingCommandBuildError::BadRequest(
                "coupon value must be a number or string".to_owned(),
            ))
        }
        None => {
            return Err(AdminMarketingCommandBuildError::BadRequest(
                "coupon value is required".to_owned(),
            ))
        }
    };
    if coupon_type == "discount" {
        let normalized = raw.trim().trim_end_matches('%').replace(',', "");
        let numeric = normalized.parse::<f64>().map_err(|_| {
            AdminMarketingCommandBuildError::BadRequest(
                "coupon discount value must be numeric".to_owned(),
            )
        })?;
        if !numeric.is_finite() || numeric <= 0.0 || numeric > 100.0 {
            return Err(AdminMarketingCommandBuildError::BadRequest(
                "coupon discount value must be greater than 0 and at most 100".to_owned(),
            ));
        }
        return Ok(NormalizedCouponValue {
            value: format!("{numeric:.2}%"),
            amount_cents: 0,
            discount_value: Some(format!("{numeric:.4}")),
        });
    }

    let amount_cents = decimal_money_to_cents(&raw)?;
    Ok(NormalizedCouponValue {
        value: cents_to_money_string(amount_cents),
        amount_cents,
        discount_value: None,
    })
}

fn decimal_money_to_cents(value: &str) -> Result<i64, AdminMarketingCommandBuildError> {
    let value = value.trim().trim_start_matches('$').replace(',', "");
    if value.is_empty() || value.starts_with('-') {
        return Err(AdminMarketingCommandBuildError::BadRequest(
            "coupon value must be greater than zero".to_owned(),
        ));
    }
    let parts: Vec<&str> = value.split('.').collect();
    if parts.len() > 2 || parts[0].is_empty() || !parts[0].chars().all(|ch| ch.is_ascii_digit()) {
        return Err(AdminMarketingCommandBuildError::BadRequest(
            "coupon value must be a valid money amount".to_owned(),
        ));
    }
    let dollars = parts[0].parse::<i64>().map_err(|_| {
        AdminMarketingCommandBuildError::BadRequest("coupon value is too large".to_owned())
    })?;
    let cents = if parts.len() == 2 {
        if parts[1].len() > 2 || !parts[1].chars().all(|ch| ch.is_ascii_digit()) {
            return Err(AdminMarketingCommandBuildError::BadRequest(
                "coupon value must have at most 2 decimal places".to_owned(),
            ));
        }
        let mut cents = parts[1].to_owned();
        while cents.len() < 2 {
            cents.push('0');
        }
        cents.parse::<i64>().unwrap_or(0)
    } else {
        0
    };
    let total = dollars
        .checked_mul(100)
        .and_then(|value| value.checked_add(cents))
        .ok_or_else(|| {
            AdminMarketingCommandBuildError::BadRequest("coupon value is too large".to_owned())
        })?;
    if total <= 0 {
        return Err(AdminMarketingCommandBuildError::BadRequest(
            "coupon value must be greater than zero".to_owned(),
        ));
    }
    Ok(total)
}

fn cents_to_money_string(cents: i64) -> String {
    format!("${}.{:02}", cents / 100, cents.rem_euclid(100))
}

fn normalize_id_value(
    value: Option<&Value>,
    field_name: &str,
) -> Result<i64, AdminMarketingCommandBuildError> {
    let id = match value {
        Some(Value::String(value)) => value.trim().parse::<i64>().ok(),
        Some(Value::Number(value)) => value.as_i64(),
        _ => None,
    }
    .ok_or_else(|| {
        AdminMarketingCommandBuildError::BadRequest(format!(
            "{field_name} must be a positive integer"
        ))
    })?;
    if id <= 0 {
        return Err(AdminMarketingCommandBuildError::BadRequest(format!(
            "{field_name} must be a positive integer"
        )));
    }
    Ok(id)
}

fn normalize_batch_count(value: Option<i64>) -> Result<i64, AdminMarketingCommandBuildError> {
    let count = value.unwrap_or(0);
    if !(1..=MAX_BATCH_COUNT).contains(&count) {
        return Err(AdminMarketingCommandBuildError::BadRequest(format!(
            "count must be between 1 and {MAX_BATCH_COUNT}"
        )));
    }
    Ok(count)
}

fn normalize_code_prefix(value: Option<&str>) -> Result<String, AdminMarketingCommandBuildError> {
    let prefix = value.unwrap_or("").trim().to_ascii_uppercase();
    if prefix.is_empty() {
        return Err(AdminMarketingCommandBuildError::BadRequest(
            "prefix is required".to_owned(),
        ));
    }
    if prefix.len() > MAX_PREFIX_LEN {
        return Err(AdminMarketingCommandBuildError::BadRequest(format!(
            "prefix must be at most {MAX_PREFIX_LEN} characters"
        )));
    }
    if !prefix
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_'))
    {
        return Err(AdminMarketingCommandBuildError::BadRequest(
            "prefix may only contain letters, numbers, -, and _".to_owned(),
        ));
    }
    Ok(prefix)
}

fn normalize_promo_code_status(
    value: Option<&str>,
) -> Result<String, AdminMarketingCommandBuildError> {
    match value.unwrap_or("").trim().to_ascii_lowercase().as_str() {
        "available" | "claimed" | "used" | "voided" => {
            Ok(value.unwrap().trim().to_ascii_lowercase())
        }
        _ => Err(AdminMarketingCommandBuildError::BadRequest(
            "status must be available, claimed, used, or voided".to_owned(),
        )),
    }
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
    state: &AdminMarketingState,
) -> Result<String, AdminMarketingCommandBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(AdminMarketingCommandBuildError::System)
}

fn normalize_request_id(
    headers: &HeaderMap,
    state: &AdminMarketingState,
) -> Result<String, AdminMarketingCommandBuildError> {
    if let Some(value) = header_value(headers, REQUEST_ID_HEADER) {
        if value.chars().count() > MAX_REQUEST_ID_LEN
            || !value.bytes().all(|byte| (0x21..=0x7e).contains(&byte))
        {
            return Err(AdminMarketingCommandBuildError::BadRequest(format!(
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

fn bad_request(message: impl Into<String>) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(PlusApiResult::error("4001", message.into())),
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

fn command_build_error_response(error: AdminMarketingCommandBuildError) -> Response {
    match error {
        AdminMarketingCommandBuildError::BadRequest(message) => bad_request(message),
        AdminMarketingCommandBuildError::System(error) => {
            marketing_system_response("marketing command is invalid", error)
        }
    }
}

fn marketing_system_response(context: &str, error: DomainError) -> Response {
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
