use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;

use crate::api::response::PlusApiResult;
use crate::api::subject::admin_operator_fields;
use crate::ports::{AdminDashboardQuery, AdminDashboardReadStore, AdminDashboardSubject};

#[derive(Clone)]
struct AdminDashboardState {
    read_store: Arc<dyn AdminDashboardReadStore + Send + Sync>,
}

pub fn admin_dashboard_router_with_read_store(
    read_store: Arc<dyn AdminDashboardReadStore + Send + Sync>,
) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/system/dashboard/admin/overview",
            get(fetch_admin_dashboard_overview),
        )
        .with_state(AdminDashboardState { read_store })
}

async fn fetch_admin_dashboard_overview(
    State(state): State<AdminDashboardState>,
    trusted: TrustedRequestSubject,
) -> Response {
    let operator = admin_operator_fields(trusted);
    let query = AdminDashboardQuery {
        subject: AdminDashboardSubject {
            tenant_id: operator.tenant_id,
            organization_id: operator.organization_id,
            operator_id: operator.operator_id,
            operator_type: operator.operator_type,
        },
    };

    match state.read_store.load_dashboard(query).await {
        Ok(snapshot) => Json(PlusApiResult::success(snapshot)).into_response(),
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(PlusApiResult::error(
                "5000",
                format!("admin dashboard read model is unavailable: {error}"),
            )),
        )
            .into_response(),
    }
}
