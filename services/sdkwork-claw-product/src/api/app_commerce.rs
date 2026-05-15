use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use serde::Serialize;

use crate::api::response::PlusApiResult;

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
            get(unavailable_read),
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
            get(empty_list),
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
