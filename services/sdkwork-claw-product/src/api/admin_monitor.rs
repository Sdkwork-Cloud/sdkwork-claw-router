use std::sync::Arc;

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::Serialize;

use crate::api::response::PlusApiResult;
use crate::ports::{AdminMonitorQuery, AdminMonitorReadStore, AdminMonitorSubject};

#[derive(Clone)]
struct AdminMonitorState {
    read_store: Arc<dyn AdminMonitorReadStore + Send + Sync>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminMonitorListResponse<T> {
    items: Vec<T>,
}

pub fn admin_monitor_router_with_read_store(
    read_store: Arc<dyn AdminMonitorReadStore + Send + Sync>,
) -> Router {
    Router::new()
        .route("/backend/v3/api/router/monitor/nodes", get(fetch_nodes))
        .route("/backend/v3/api/router/monitor/alerts", get(fetch_alerts))
        .route(
            "/backend/v3/api/router/monitor/performance",
            get(fetch_performance),
        )
        .with_state(AdminMonitorState { read_store })
}

async fn fetch_nodes(State(state): State<AdminMonitorState>, headers: HeaderMap) -> Response {
    let query = match monitor_query_from_headers(&headers) {
        Ok(query) => query,
        Err(response) => return response,
    };
    match state.read_store.list_monitor_nodes(query).await {
        Ok(items) => monitor_success(items),
        Err(error) => monitor_system_response("monitor nodes read model is unavailable", error),
    }
}

async fn fetch_alerts(State(state): State<AdminMonitorState>, headers: HeaderMap) -> Response {
    let query = match monitor_query_from_headers(&headers) {
        Ok(query) => query,
        Err(response) => return response,
    };
    match state.read_store.list_monitor_alerts(query).await {
        Ok(items) => monitor_success(items),
        Err(error) => monitor_system_response("monitor alerts read model is unavailable", error),
    }
}

async fn fetch_performance(State(state): State<AdminMonitorState>, headers: HeaderMap) -> Response {
    let query = match monitor_query_from_headers(&headers) {
        Ok(query) => query,
        Err(response) => return response,
    };
    match state.read_store.list_monitor_performance(query).await {
        Ok(items) => monitor_success(items),
        Err(error) => {
            monitor_system_response("monitor performance read model is unavailable", error)
        }
    }
}

fn monitor_query_from_headers(headers: &HeaderMap) -> Result<AdminMonitorQuery, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| AdminMonitorQuery {
            subject: AdminMonitorSubject {
                tenant_id: subject.tenant_id,
                organization_id: subject.organization_id,
                operator_id: subject.operator_id,
                operator_type: subject.operator_type,
            },
        })
        .map_err(|error| {
            (
                StatusCode::UNAUTHORIZED,
                Json(PlusApiResult::error("4010", error.to_string())),
            )
                .into_response()
        })
}

fn monitor_success<T>(items: Vec<T>) -> Response
where
    T: Serialize,
{
    Json(PlusApiResult::success(AdminMonitorListResponse { items })).into_response()
}

fn monitor_system_response(context: &str, error: crate::domain::DomainError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}
