use std::sync::Arc;

use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::{Deserialize, Serialize};

use crate::api::response::PlusApiResult;
use crate::ports::{
    AppCommerceExchangeReadStore, AppCommerceExchangeRuleQuery,
    AppCommercePointsExchangeRateResponse, AppCommerceSubject,
};

const MAX_ASSET_TYPE_LEN: usize = 32;
const POINTS_ASSET_TYPE: &str = "POINTS";
const CASH_ASSET_TYPE: &str = "CASH";

#[derive(Clone)]
struct AppCommerceState {
    exchange_store: Option<Arc<dyn AppCommerceExchangeReadStore + Send + Sync>>,
    require_subject: bool,
}

#[derive(Debug, Deserialize)]
struct ExchangeRulesQueryRequest {
    #[serde(rename = "source_asset_type", alias = "sourceAssetType")]
    source_asset_type: Option<String>,
    #[serde(rename = "target_asset_type", alias = "targetAssetType")]
    target_asset_type: Option<String>,
}

#[derive(Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
struct WalletOverviewResponse {
    available_amount: String,
    frozen_amount: String,
    currency_code: String,
}

#[derive(Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
struct PointsBalanceResponse {
    available_points: i64,
    frozen_points: i64,
}

#[derive(Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
struct TokenBalanceResponse {
    available_tokens: i64,
    frozen_tokens: i64,
}

#[derive(Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
struct VipInfoResponse {
    level_code: String,
    level_name: String,
    status: String,
}

#[derive(Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
struct DailyRewardStatusResponse {
    available: bool,
    claimed_today: bool,
}

pub fn app_commerce_foundation_router() -> Router {
    app_commerce_foundation_router_with_state(AppCommerceState {
        exchange_store: None,
        require_subject: false,
    })
}

pub fn app_commerce_foundation_router_with_exchange_store(
    exchange_store: Arc<dyn AppCommerceExchangeReadStore + Send + Sync>,
) -> Router {
    app_commerce_foundation_router_with_state(AppCommerceState {
        exchange_store: Some(exchange_store),
        require_subject: true,
    })
}

fn app_commerce_foundation_router_with_state(state: AppCommerceState) -> Router {
    Router::new()
        .route("/app/v3/api/billing/wallet/overview", get(wallet_overview))
        .route("/app/v3/api/billing/wallet/accounts", get(empty_list))
        .route("/app/v3/api/billing/wallet/transactions", get(empty_list))
        .route(
            "/app/v3/api/billing/wallet/transactions/{transactionId}",
            get(unavailable_path_item),
        )
        .route(
            "/app/v3/api/billing/wallet/operations/{requestNo}",
            get(unavailable_path_item),
        )
        .route(
            "/app/v3/api/billing/wallet/topups",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/wallet/withdrawals",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/wallet/transfers",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/wallet/exchanges",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/account/points/exchange_rate",
            get(points_exchange_rate),
        )
        .route(
            "/app/v3/api/billing/account/points/recharges/records",
            get(empty_list),
        )
        .route(
            "/app/v3/api/billing/account/points/recharges/orders/{order_no}",
            get(unavailable_path_item),
        )
        .route(
            "/app/v3/api/billing/account/points/recharges/orders/{order_no}/cancel",
            post(unavailable_command_with_path),
        )
        .route(
            "/app/v3/api/billing/account/points/transfers",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/account/points/exchanges/rules",
            get(points_exchange_rules),
        )
        .route(
            "/app/v3/api/billing/account/points/exchanges",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/account/points/exchanges/{exchangeNo}",
            get(unavailable_path_item),
        )
        .route("/app/v3/api/billing/account/tokens", get(token_balance))
        .route(
            "/app/v3/api/billing/account/tokens/deductions",
            post(unavailable_command),
        )
        .route("/app/v3/api/billing/coupons/catalog", get(empty_list))
        .route(
            "/app/v3/api/billing/coupons/catalog/{couponId}",
            get(unavailable_path_item),
        )
        .route(
            "/app/v3/api/billing/coupons/claims",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/coupons/usage",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/coupons/usage_reversals",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/users/current/coupons/{userCouponId}",
            get(unavailable_path_item),
        )
        .route(
            "/app/v3/api/billing/payments/records/{paymentId}",
            get(unavailable_path_item),
        )
        .route("/app/v3/api/billing/vip/info", get(vip_info))
        .route("/app/v3/api/billing/vip/levels", get(empty_list))
        .route("/app/v3/api/billing/vip/benefits", get(empty_list))
        .route("/app/v3/api/billing/vip/status", get(vip_info))
        .route("/app/v3/api/billing/vip/pack_groups", get(empty_list))
        .route(
            "/app/v3/api/billing/vip/pack_groups/{packGroupId}",
            get(unavailable_path_item),
        )
        .route(
            "/app/v3/api/billing/vip/pack_groups/{packGroupId}/packs",
            get(empty_group_packs),
        )
        .route("/app/v3/api/billing/vip/packs", get(empty_list))
        .route(
            "/app/v3/api/billing/vip/packs/{packId}",
            get(unavailable_path_item),
        )
        .route(
            "/app/v3/api/billing/vip/purchase",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/vip/purchase/renew",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/vip/purchase/upgrade",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/vip/points/balance",
            get(points_balance),
        )
        .route("/app/v3/api/billing/vip/points/history", get(empty_list))
        .route(
            "/app/v3/api/billing/vip/points/daily_rewards",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/vip/points/daily_rewards/status",
            get(daily_reward_status),
        )
        .route("/app/v3/api/billing/vip/privileges/usage", get(empty_list))
        .route(
            "/app/v3/api/billing/vip/privileges/speed_ups",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/preflight/estimates",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/preflight/prechecks",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/preflight/preholds",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/preflight/settlements",
            post(unavailable_command),
        )
        .route(
            "/app/v3/api/billing/preflight/releases",
            post(unavailable_command),
        )
        .with_state(state)
}

async fn wallet_overview() -> Response {
    Json(PlusApiResult::success(WalletOverviewResponse {
        available_amount: "0.000000".to_owned(),
        frozen_amount: "0.000000".to_owned(),
        currency_code: "POINT".to_owned(),
    }))
    .into_response()
}

async fn points_balance() -> Response {
    Json(PlusApiResult::success(PointsBalanceResponse::default())).into_response()
}

async fn token_balance() -> Response {
    Json(PlusApiResult::success(TokenBalanceResponse::default())).into_response()
}

async fn vip_info() -> Response {
    Json(PlusApiResult::success(VipInfoResponse {
        level_code: "FREE".to_owned(),
        level_name: "Free".to_owned(),
        status: "inactive".to_owned(),
    }))
    .into_response()
}

async fn daily_reward_status() -> Response {
    Json(PlusApiResult::success(DailyRewardStatusResponse::default())).into_response()
}

async fn points_exchange_rate(
    State(state): State<AppCommerceState>,
    headers: HeaderMap,
) -> Response {
    let Some(store) = state.exchange_store.as_ref() else {
        return unavailable_read().await;
    };
    let subject = match resolve_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match store.load_points_exchange_rate(subject).await {
        Ok(Some(item)) => Json(PlusApiResult::success(
            AppCommercePointsExchangeRateResponse {
                source_asset_type: item.source_asset_type,
                target_asset_type: item.target_asset_type,
                rate: item.rate,
            },
        ))
        .into_response(),
        Ok(None) => not_found_response("exchange rule was not found"),
        Err(error) => commerce_system_response("exchange rule read model is unavailable", error),
    }
}

async fn points_exchange_rules(
    State(state): State<AppCommerceState>,
    Query(params): Query<ExchangeRulesQueryRequest>,
    headers: HeaderMap,
) -> Response {
    let Some(store) = state.exchange_store.as_ref() else {
        return empty_list().await;
    };
    let subject = match resolve_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let source_asset_type = match normalize_optional_asset_type(params.source_asset_type.as_deref())
    {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };
    let target_asset_type = match normalize_optional_asset_type(params.target_asset_type.as_deref())
    {
        Ok(value) => value,
        Err(message) => return bad_request(message),
    };

    match store
        .list_exchange_rules(AppCommerceExchangeRuleQuery {
            subject,
            source_asset_type,
            target_asset_type,
        })
        .await
    {
        Ok(items) => Json(PlusApiResult::success(items)).into_response(),
        Err(error) => commerce_system_response("exchange rule read model is unavailable", error),
    }
}

async fn empty_list() -> Response {
    Json(PlusApiResult::success(Vec::<serde_json::Value>::new())).into_response()
}

async fn empty_group_packs(Path(_pack_group_id): Path<String>) -> Response {
    empty_list().await
}

async fn unavailable_path_item(Path(_id): Path<String>) -> Response {
    unavailable_read().await
}

async fn unavailable_command_with_path(Path(_id): Path<String>) -> Response {
    unavailable_command().await
}

async fn unavailable_read() -> Response {
    (
        StatusCode::NOT_IMPLEMENTED,
        Json(PlusApiResult::error(
            "5010",
            "commerce foundation read model is not configured",
        )),
    )
        .into_response()
}

async fn unavailable_command() -> Response {
    (
        StatusCode::NOT_IMPLEMENTED,
        Json(PlusApiResult::error(
            "5010",
            "commerce foundation command store is not configured",
        )),
    )
        .into_response()
}

fn resolve_subject(
    headers: &HeaderMap,
    required: bool,
) -> Result<Option<AppCommerceSubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(AppCommerceSubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            user_id: subject.user_id,
        })),
        Err(error) if required => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", error.to_string())),
        )
            .into_response()),
        Err(_) => Ok(None),
    }
}

fn normalize_optional_asset_type(value: Option<&str>) -> Result<Option<String>, String> {
    let Some(value) = value.map(str::trim).filter(|value| !value.is_empty()) else {
        return Ok(None);
    };
    let normalized = value.to_ascii_uppercase();
    if normalized.chars().count() > MAX_ASSET_TYPE_LEN {
        return Err(format!(
            "asset type must be at most {MAX_ASSET_TYPE_LEN} characters"
        ));
    }
    if !normalized
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_'))
    {
        return Err("asset type may only contain letters, numbers, -, and _".to_owned());
    }
    if normalized != POINTS_ASSET_TYPE && normalized != CASH_ASSET_TYPE {
        return Err("exchange rule currently supports POINTS to CASH only".to_owned());
    }
    Ok(Some(normalized))
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

fn commerce_system_response(context: &str, error: crate::domain::DomainError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}
