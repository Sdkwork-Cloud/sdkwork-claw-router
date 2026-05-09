use std::sync::Arc;

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;

use crate::api::response::PlusApiResult;
use crate::ports::{
    AppPlaygroundHistoryItem, AppPlaygroundHistoryItems, AppPlaygroundHistoryReadFuture,
    AppPlaygroundHistoryReadStore, AppPlaygroundHistorySubject,
};

#[derive(Clone)]
struct AppPlaygroundHistoryState {
    read_store: Arc<dyn AppPlaygroundHistoryReadStore + Send + Sync>,
    require_subject: bool,
}

struct EmptyAppPlaygroundHistoryReadStore;

impl AppPlaygroundHistoryReadStore for EmptyAppPlaygroundHistoryReadStore {
    fn load_playground_history<'a>(
        &'a self,
        _subject: Option<AppPlaygroundHistorySubject>,
    ) -> AppPlaygroundHistoryReadFuture<'a, Vec<AppPlaygroundHistoryItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }
}

pub fn app_playground_history_router() -> Router {
    app_playground_history_router_with_state(Arc::new(EmptyAppPlaygroundHistoryReadStore), false)
}

pub fn app_playground_history_router_with_read_store(
    read_store: Arc<dyn AppPlaygroundHistoryReadStore + Send + Sync>,
) -> Router {
    app_playground_history_router_with_state(read_store, true)
}

fn app_playground_history_router_with_state(
    read_store: Arc<dyn AppPlaygroundHistoryReadStore + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route("/app/v3/api/playground/history", get(fetch_history))
        .with_state(AppPlaygroundHistoryState {
            read_store,
            require_subject,
        })
}

async fn fetch_history(
    State(state): State<AppPlaygroundHistoryState>,
    headers: HeaderMap,
) -> Response {
    let subject = match playground_history_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_playground_history(subject).await {
        Ok(items) => Json(PlusApiResult::success(AppPlaygroundHistoryItems::new(
            items,
        )))
        .into_response(),
        Err(error) => app_playground_history_read_model_error(error),
    }
}

fn playground_history_subject(
    headers: &HeaderMap,
    require_subject: bool,
) -> Result<Option<AppPlaygroundHistorySubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(AppPlaygroundHistorySubject {
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

fn app_playground_history_read_model_error(error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error(
            "5000",
            format!("app playground history read model is unavailable: {error}"),
        )),
    )
        .into_response()
}
