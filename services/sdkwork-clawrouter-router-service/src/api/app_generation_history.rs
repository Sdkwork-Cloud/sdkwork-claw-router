use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;

use crate::api::response::PlusApiResult;
use crate::api::subject::map_optional_app_user_subject;
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
    subject: Option<TrustedRequestSubject>,
) -> Response {
    let subject = match map_optional_app_user_subject(subject, state.require_subject, |trusted| {
        AppGenerationHistorySubject {
            tenant_id: trusted.tenant_id,
            organization_id: trusted.organization_id,
            user_id: trusted.user_id,
        }
    }) {
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
