use std::sync::Arc;

use axum::extract::{Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::Deserialize;

use crate::api::response::PlusApiResult;
use crate::ports::{
    AdminAnalyticsQuery, AdminAnalyticsReadStore, AdminAnalyticsSubject, AdminAnalyticsTimeRange,
};

#[derive(Clone)]
struct AdminAnalyticsState {
    read_store: Arc<dyn AdminAnalyticsReadStore + Send + Sync>,
}

#[derive(Debug, Clone, Deserialize)]
struct AdminAnalyticsQueryParams {
    time_range: Option<String>,
    start_time: Option<String>,
    end_time: Option<String>,
    limit: Option<i64>,
}

pub fn admin_analytics_router_with_read_store(
    read_store: Arc<dyn AdminAnalyticsReadStore + Send + Sync>,
) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/system/analytics/admin/overview",
            get(fetch_admin_analytics_overview),
        )
        .with_state(AdminAnalyticsState { read_store })
}

async fn fetch_admin_analytics_overview(
    State(state): State<AdminAnalyticsState>,
    headers: HeaderMap,
    Query(params): Query<AdminAnalyticsQueryParams>,
) -> Response {
    let query = match analytics_query_from_headers(&headers, params) {
        Ok(query) => query,
        Err(response) => return response,
    };

    match state.read_store.load_admin_analytics(query).await {
        Ok(snapshot) => Json(PlusApiResult::success(snapshot)).into_response(),
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(PlusApiResult::error(
                "5000",
                format!("admin analytics read model is unavailable: {error}"),
            )),
        )
            .into_response(),
    }
}

fn analytics_query_from_headers(
    headers: &HeaderMap,
    params: AdminAnalyticsQueryParams,
) -> Result<AdminAnalyticsQuery, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| AdminAnalyticsQuery {
            subject: AdminAnalyticsSubject {
                tenant_id: subject.tenant_id,
                organization_id: subject.organization_id,
                operator_id: subject.operator_id,
                operator_type: subject.operator_type,
            },
            time_range: AdminAnalyticsTimeRange::parse(params.time_range.as_deref()),
            start_time: normalize_optional_text(params.start_time),
            end_time: normalize_optional_text(params.end_time),
            limit: normalize_limit(params.limit),
        })
        .map_err(|error| {
            (
                StatusCode::UNAUTHORIZED,
                Json(PlusApiResult::error("4010", error.to_string())),
            )
                .into_response()
        })
}

fn normalize_optional_text(value: Option<String>) -> Option<String> {
    value.and_then(|item| {
        let trimmed = item.trim();
        if trimmed.is_empty() {
            None
        } else {
            Some(trimmed.to_owned())
        }
    })
}

fn normalize_limit(value: Option<i64>) -> i64 {
    value.unwrap_or(10).clamp(3, 50)
}
