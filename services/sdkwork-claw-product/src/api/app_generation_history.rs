use std::sync::Arc;

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;

use crate::api::response::PlusApiResult;
use crate::ports::{
    AppGenerationHistoryItem, AppGenerationHistoryItems, AppGenerationHistoryReadFuture,
    AppGenerationHistoryReadStore, AppGenerationHistorySubject,
};

#[derive(Clone)]
struct AppGenerationHistoryState {
    read_store: Arc<dyn AppGenerationHistoryReadStore + Send + Sync>,
    require_subject: bool,
}

struct EmptyAppGenerationHistoryReadStore;

impl AppGenerationHistoryReadStore for EmptyAppGenerationHistoryReadStore {
    fn load_generation_history<'a>(
        &'a self,
        _subject: Option<AppGenerationHistorySubject>,
    ) -> AppGenerationHistoryReadFuture<'a, Vec<AppGenerationHistoryItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }
}

pub fn app_generation_history_router() -> Router {
    app_generation_history_router_with_state(Arc::new(EmptyAppGenerationHistoryReadStore), false)
}

pub fn app_generation_history_router_with_read_store(
    read_store: Arc<dyn AppGenerationHistoryReadStore + Send + Sync>,
) -> Router {
    app_generation_history_router_with_state(read_store, true)
}

fn app_generation_history_router_with_state(
    read_store: Arc<dyn AppGenerationHistoryReadStore + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route("/app/v3/api/ai/generations", get(fetch_history))
        .with_state(AppGenerationHistoryState {
            read_store,
            require_subject,
        })
}

async fn fetch_history(
    State(state): State<AppGenerationHistoryState>,
    headers: HeaderMap,
) -> Response {
    let subject = match generation_history_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_generation_history(subject).await {
        Ok(items) => Json(PlusApiResult::success(AppGenerationHistoryItems::new(
            items,
        )))
        .into_response(),
        Err(error) => app_generation_history_read_model_error(error),
    }
}

fn generation_history_subject(
    headers: &HeaderMap,
    require_subject: bool,
) -> Result<Option<AppGenerationHistorySubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(AppGenerationHistorySubject {
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

fn app_generation_history_read_model_error(error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error(
            "5000",
            format!("app generation history read model is unavailable: {error}"),
        )),
    )
        .into_response()
}
