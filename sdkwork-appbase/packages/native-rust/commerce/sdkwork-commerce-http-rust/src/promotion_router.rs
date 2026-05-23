use axum::extract::{Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use sdkwork_commerce_core::CommerceServiceError;
use sdkwork_commerce_promotion::{
    CurrentUserCouponItem, CurrentUserCouponListQuery, PointsBalance, PointsBalanceQuery,
    PointsHistoryItem, PointsHistoryQuery, RedeemCodeCommand, RedeemCodeOutcome,
};
use sdkwork_commerce_storage_sqlx::{PostgresCommercePromotionStore, SqliteCommercePromotionStore};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, SqlitePool};
use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

const X_SDKWORK_TENANT_ID: &str = "x-sdkwork-tenant-id";
const X_SDKWORK_ORGANIZATION_ID: &str = "x-sdkwork-organization-id";
const X_SDKWORK_USER_ID: &str = "x-sdkwork-user-id";
const IDEMPOTENCY_KEY_HEADER: &str = "Idempotency-Key";
const REQUEST_NO_HEADER: &str = "Sdkwork-Request-No";
const X_REQUEST_ID_HEADER: &str = "X-Request-Id";
const MAX_REDEEM_CODE_LEN: usize = 128;

pub type AppbasePromotionFuture<'a, T> =
    Pin<Box<dyn Future<Output = Result<T, CommerceServiceError>> + Send + 'a>>;

pub trait AppbasePromotionStore: Send + Sync {
    fn list_current_user_coupons<'a>(
        &'a self,
        query: CurrentUserCouponListQuery,
    ) -> AppbasePromotionFuture<'a, Vec<CurrentUserCouponItem>>;

    fn retrieve_points_balance<'a>(
        &'a self,
        query: PointsBalanceQuery,
    ) -> AppbasePromotionFuture<'a, PointsBalance>;

    fn list_points_history<'a>(
        &'a self,
        query: PointsHistoryQuery,
    ) -> AppbasePromotionFuture<'a, Vec<PointsHistoryItem>>;

    fn redeem_code<'a>(
        &'a self,
        command: RedeemCodeCommand,
    ) -> AppbasePromotionFuture<'a, RedeemCodeOutcome>;
}

#[derive(Clone)]
struct AppPromotionState {
    store: Arc<dyn AppbasePromotionStore>,
}

#[derive(Debug, Clone)]
struct AppPromotionSubject {
    tenant_id: String,
    organization_id: Option<String>,
    user_id: String,
}

#[derive(Debug, Deserialize)]
struct CouponListQueryParams {
    status: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RedeemCodeRequest {
    code: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppPromotionApiResult<T: Serialize> {
    code: String,
    msg: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CurrentUserCouponItemResponse {
    id: String,
    code: String,
    amount: String,
    date: String,
    status: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PointsBalanceResponse {
    available_points: i64,
    frozen_points: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PointsHistoryItemResponse {
    id: String,
    amount: i64,
    direction: String,
    balance_after: i64,
    business_type: String,
    created_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct RedeemCodeOutcomeResponse {
    message: String,
    amount: String,
    credited_points: i64,
    balance: i64,
}

impl AppbasePromotionStore for SqliteCommercePromotionStore {
    fn list_current_user_coupons<'a>(
        &'a self,
        query: CurrentUserCouponListQuery,
    ) -> AppbasePromotionFuture<'a, Vec<CurrentUserCouponItem>> {
        Box::pin(async move { self.list_current_user_coupons(query).await })
    }

    fn retrieve_points_balance<'a>(
        &'a self,
        query: PointsBalanceQuery,
    ) -> AppbasePromotionFuture<'a, PointsBalance> {
        Box::pin(async move { self.retrieve_points_balance(query).await })
    }

    fn list_points_history<'a>(
        &'a self,
        query: PointsHistoryQuery,
    ) -> AppbasePromotionFuture<'a, Vec<PointsHistoryItem>> {
        Box::pin(async move { self.list_points_history(query).await })
    }

    fn redeem_code<'a>(
        &'a self,
        command: RedeemCodeCommand,
    ) -> AppbasePromotionFuture<'a, RedeemCodeOutcome> {
        Box::pin(async move { self.redeem_code(command).await })
    }
}

impl AppbasePromotionStore for PostgresCommercePromotionStore {
    fn list_current_user_coupons<'a>(
        &'a self,
        query: CurrentUserCouponListQuery,
    ) -> AppbasePromotionFuture<'a, Vec<CurrentUserCouponItem>> {
        Box::pin(async move { self.list_current_user_coupons(query).await })
    }

    fn retrieve_points_balance<'a>(
        &'a self,
        query: PointsBalanceQuery,
    ) -> AppbasePromotionFuture<'a, PointsBalance> {
        Box::pin(async move { self.retrieve_points_balance(query).await })
    }

    fn list_points_history<'a>(
        &'a self,
        query: PointsHistoryQuery,
    ) -> AppbasePromotionFuture<'a, Vec<PointsHistoryItem>> {
        Box::pin(async move { self.list_points_history(query).await })
    }

    fn redeem_code<'a>(
        &'a self,
        command: RedeemCodeCommand,
    ) -> AppbasePromotionFuture<'a, RedeemCodeOutcome> {
        Box::pin(async move { self.redeem_code(command).await })
    }
}

impl<T: Serialize> AppPromotionApiResult<T> {
    fn success(data: T) -> Self {
        Self {
            code: "2000".to_owned(),
            msg: "SUCCESS".to_owned(),
            data: Some(data),
        }
    }
}

impl AppPromotionApiResult<()> {
    fn error(code: impl Into<String>, msg: impl Into<String>) -> Self {
        Self {
            code: code.into(),
            msg: msg.into(),
            data: None,
        }
    }
}

pub fn app_promotion_router_with_sqlite_pool(pool: SqlitePool) -> Router {
    app_promotion_router_with_store(Arc::new(SqliteCommercePromotionStore::new(pool)))
}

pub fn app_promotion_router_with_postgres_pool(pool: PgPool) -> Router {
    app_promotion_router_with_store(Arc::new(PostgresCommercePromotionStore::new(pool)))
}

pub fn app_promotion_router_with_store(store: Arc<dyn AppbasePromotionStore>) -> Router {
    Router::new()
        .route("/app/v3/api/coupons", get(fetch_current_user_coupons))
        .route("/app/v3/api/wallet/points", get(fetch_points_balance))
        .route(
            "/app/v3/api/wallet/points/history",
            get(fetch_points_history),
        )
        .route("/app/v3/api/coupons/redemptions", post(redeem_code))
        .with_state(AppPromotionState { store })
}

async fn fetch_current_user_coupons(
    State(state): State<AppPromotionState>,
    headers: HeaderMap,
    Query(query): Query<CouponListQueryParams>,
) -> Response {
    let subject = match app_promotion_subject_from_headers(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match CurrentUserCouponListQuery::new(
        &subject.tenant_id,
        subject.organization_id.as_deref(),
        &subject.user_id,
        query.status.as_deref(),
    ) {
        Ok(query) => query,
        Err(error) => return commerce_error_response(error),
    };

    match state.store.list_current_user_coupons(query).await {
        Ok(items) => Json(AppPromotionApiResult::success(
            items
                .into_iter()
                .map(map_current_user_coupon)
                .collect::<Vec<_>>(),
        ))
        .into_response(),
        Err(error) => commerce_error_response(error),
    }
}

async fn fetch_points_balance(
    State(state): State<AppPromotionState>,
    headers: HeaderMap,
) -> Response {
    let subject = match app_promotion_subject_from_headers(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match PointsBalanceQuery::new(
        &subject.tenant_id,
        subject.organization_id.as_deref(),
        &subject.user_id,
    ) {
        Ok(query) => query,
        Err(error) => return commerce_error_response(error),
    };

    match state.store.retrieve_points_balance(query).await {
        Ok(balance) => {
            Json(AppPromotionApiResult::success(map_points_balance(balance))).into_response()
        }
        Err(error) => commerce_error_response(error),
    }
}

async fn fetch_points_history(
    State(state): State<AppPromotionState>,
    headers: HeaderMap,
) -> Response {
    let subject = match app_promotion_subject_from_headers(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = match PointsHistoryQuery::new(
        &subject.tenant_id,
        subject.organization_id.as_deref(),
        &subject.user_id,
    ) {
        Ok(query) => query,
        Err(error) => return commerce_error_response(error),
    };

    match state.store.list_points_history(query).await {
        Ok(items) => Json(AppPromotionApiResult::success(
            items
                .into_iter()
                .map(map_points_history)
                .collect::<Vec<_>>(),
        ))
        .into_response(),
        Err(error) => commerce_error_response(error),
    }
}

async fn redeem_code(
    State(state): State<AppPromotionState>,
    headers: HeaderMap,
    Json(request): Json<RedeemCodeRequest>,
) -> Response {
    let subject = match app_promotion_subject_from_headers(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let code = match validate_redeem_code_request(request) {
        Ok(code) => code,
        Err(message) => return validation_response(message),
    };
    let idempotency_key = match required_text_header(&headers, IDEMPOTENCY_KEY_HEADER) {
        Ok(value) => value,
        Err(response) => return response,
    };
    let request_no = optional_text_header(&headers, REQUEST_NO_HEADER)
        .or_else(|| optional_text_header(&headers, X_REQUEST_ID_HEADER))
        .unwrap_or_else(|| fallback_request_no(&subject, &code, &idempotency_key));
    let command = match RedeemCodeCommand::new(
        &subject.tenant_id,
        subject.organization_id.as_deref(),
        &subject.user_id,
        &code,
        &request_no,
        &idempotency_key,
    ) {
        Ok(command) => command,
        Err(error) => return commerce_error_response(error),
    };

    match state.store.redeem_code(command).await {
        Ok(outcome) => Json(AppPromotionApiResult::success(map_redeem_code_outcome(
            outcome,
        )))
        .into_response(),
        Err(error) => commerce_error_response(error),
    }
}

fn app_promotion_subject_from_headers(
    headers: &HeaderMap,
) -> Result<AppPromotionSubject, Response> {
    Ok(AppPromotionSubject {
        tenant_id: required_text_header(headers, X_SDKWORK_TENANT_ID)?,
        organization_id: optional_text_header(headers, X_SDKWORK_ORGANIZATION_ID),
        user_id: required_text_header(headers, X_SDKWORK_USER_ID)?,
    })
}

fn required_text_header(headers: &HeaderMap, name: &'static str) -> Result<String, Response> {
    let value = headers
        .get(name)
        .ok_or_else(|| unauthorized_response(format!("{name} header is required")))?
        .to_str()
        .map(str::trim)
        .map_err(|_| unauthorized_response(format!("{name} header value is invalid")))?;
    if value.is_empty() {
        return Err(unauthorized_response(format!("{name} header is required")));
    }
    Ok(value.to_owned())
}

fn optional_text_header(headers: &HeaderMap, name: &'static str) -> Option<String> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
}

fn validate_redeem_code_request(request: RedeemCodeRequest) -> Result<String, String> {
    let code = request.code.unwrap_or_default().trim().to_owned();
    if code.is_empty() {
        return Err("redeem code must not be empty".to_owned());
    }
    if code.chars().count() > MAX_REDEEM_CODE_LEN {
        return Err(format!(
            "redeem code length must not exceed {MAX_REDEEM_CODE_LEN} characters"
        ));
    }
    if !code.bytes().all(|byte| (0x21..=0x7e).contains(&byte)) {
        return Err("redeem code must contain only visible ASCII characters".to_owned());
    }
    Ok(code)
}

fn map_current_user_coupon(value: CurrentUserCouponItem) -> CurrentUserCouponItemResponse {
    CurrentUserCouponItemResponse {
        id: value.id,
        code: value.code,
        amount: value.amount.as_str().to_owned(),
        date: value.date,
        status: value.status,
    }
}

fn map_points_balance(value: PointsBalance) -> PointsBalanceResponse {
    PointsBalanceResponse {
        available_points: value.available_points,
        frozen_points: value.frozen_points,
    }
}

fn map_points_history(value: PointsHistoryItem) -> PointsHistoryItemResponse {
    PointsHistoryItemResponse {
        id: value.id,
        amount: value.amount,
        direction: value.direction,
        balance_after: value.balance_after,
        business_type: value.business_type,
        created_at: value.created_at,
    }
}

fn map_redeem_code_outcome(value: RedeemCodeOutcome) -> RedeemCodeOutcomeResponse {
    RedeemCodeOutcomeResponse {
        message: value.message,
        amount: value.amount.as_str().to_owned(),
        credited_points: value.credited_points,
        balance: value.balance,
    }
}

fn commerce_error_response(error: CommerceServiceError) -> Response {
    match error.code() {
        "validation" => validation_response(error.message()),
        "unauthenticated" | "unauthorized" => unauthorized_response(error.message().to_owned()),
        "not-found" => (
            StatusCode::NOT_FOUND,
            Json(AppPromotionApiResult::error("4040", error.message())),
        )
            .into_response(),
        "conflict" | "invalid-state" | "unsupported-capability" => (
            StatusCode::CONFLICT,
            Json(AppPromotionApiResult::error("4090", error.message())),
        )
            .into_response(),
        _ => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(AppPromotionApiResult::error("5000", error.message())),
        )
            .into_response(),
    }
}

fn unauthorized_response(message: String) -> Response {
    (
        StatusCode::UNAUTHORIZED,
        Json(AppPromotionApiResult::error("4010", message)),
    )
        .into_response()
}

fn validation_response(message: impl Into<String>) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(AppPromotionApiResult::error("4001", message)),
    )
        .into_response()
}

fn fallback_request_no(subject: &AppPromotionSubject, code: &str, idempotency_key: &str) -> String {
    let code_part = code
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() || matches!(character, '-' | '_' | '.') {
                character
            } else {
                '-'
            }
        })
        .collect::<String>();
    format!(
        "coupon-redeem-{}-{}-{}",
        subject.user_id,
        code_part,
        stable_header_token(idempotency_key),
    )
}

fn stable_header_token(value: &str) -> String {
    value
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() || matches!(character, '-' | '_' | '.') {
                character
            } else {
                '-'
            }
        })
        .collect()
}
