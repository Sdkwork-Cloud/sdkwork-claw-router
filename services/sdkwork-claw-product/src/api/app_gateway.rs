use std::sync::Arc;

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;

use crate::api::response::PlusApiResult;
use crate::ports::{
    AppGatewayTraceItem, AppGatewayTraceItems, AppGatewayTracesReadFuture,
    AppGatewayTracesReadStore, AppGatewayTracesSubject,
};

#[derive(Clone)]
struct AppGatewayTracesState {
    read_store: Arc<dyn AppGatewayTracesReadStore + Send + Sync>,
    require_subject: bool,
}

struct EmptyAppGatewayTracesReadStore;

impl AppGatewayTracesReadStore for EmptyAppGatewayTracesReadStore {
    fn load_gateway_traces<'a>(
        &'a self,
        _subject: Option<AppGatewayTracesSubject>,
    ) -> AppGatewayTracesReadFuture<'a, Vec<AppGatewayTraceItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }
}

pub fn app_gateway_traces_router() -> Router {
    app_gateway_traces_router_with_state(Arc::new(EmptyAppGatewayTracesReadStore), false)
}

pub fn app_gateway_traces_router_with_read_store(
    read_store: Arc<dyn AppGatewayTracesReadStore + Send + Sync>,
) -> Router {
    app_gateway_traces_router_with_state(read_store, true)
}

fn app_gateway_traces_router_with_state(
    read_store: Arc<dyn AppGatewayTracesReadStore + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route("/app/v3/api/ai/gateway/traces", get(fetch_gateway_traces))
        .with_state(AppGatewayTracesState {
            read_store,
            require_subject,
        })
}

async fn fetch_gateway_traces(
    State(state): State<AppGatewayTracesState>,
    headers: HeaderMap,
) -> Response {
    let subject = match gateway_traces_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_gateway_traces(subject).await {
        Ok(items) => Json(PlusApiResult::success(AppGatewayTraceItems::new(items))).into_response(),
        Err(error) => app_gateway_traces_read_model_error(error),
    }
}

fn gateway_traces_subject(
    headers: &HeaderMap,
    require_subject: bool,
) -> Result<Option<AppGatewayTracesSubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(AppGatewayTracesSubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            user_id: subject.user_id,
        })),
        Err(error) if require_subject => Err((
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", error.to_string())),
        )
            .into_response()),
        Err(_) => Ok(None),
    }
}

fn app_gateway_traces_read_model_error(error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error(
            "5000",
            format!("app gateway traces read model is unavailable: {error}"),
        )),
    )
        .into_response()
}
