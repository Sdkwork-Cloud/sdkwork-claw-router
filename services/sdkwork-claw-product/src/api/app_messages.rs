use std::sync::Arc;

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;

use crate::api::response::PlusApiResult;
use crate::ports::{
    AppMessageItem, AppMessageItems, AppMessagesReadFuture, AppMessagesReadStore,
    AppMessagesSubject,
};

#[derive(Clone)]
struct AppMessagesState {
    read_store: Arc<dyn AppMessagesReadStore + Send + Sync>,
    require_subject: bool,
}

struct EmptyAppMessagesReadStore;

impl AppMessagesReadStore for EmptyAppMessagesReadStore {
    fn load_messages<'a>(
        &'a self,
        _subject: Option<AppMessagesSubject>,
    ) -> AppMessagesReadFuture<'a, Vec<AppMessageItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }
}

pub fn app_messages_router() -> Router {
    app_messages_router_with_state(Arc::new(EmptyAppMessagesReadStore), false)
}

pub fn app_messages_router_with_read_store(
    read_store: Arc<dyn AppMessagesReadStore + Send + Sync>,
) -> Router {
    app_messages_router_with_state(read_store, true)
}

fn app_messages_router_with_state(
    read_store: Arc<dyn AppMessagesReadStore + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route(
            "/app/v3/api/communication/notifications",
            get(fetch_messages),
        )
        .with_state(AppMessagesState {
            read_store,
            require_subject,
        })
}

async fn fetch_messages(State(state): State<AppMessagesState>, headers: HeaderMap) -> Response {
    let subject = match messages_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_messages(subject).await {
        Ok(items) => Json(PlusApiResult::success(AppMessageItems::new(items))).into_response(),
        Err(error) => app_messages_read_model_error(error),
    }
}

fn messages_subject(
    headers: &HeaderMap,
    require_subject: bool,
) -> Result<Option<AppMessagesSubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(AppMessagesSubject {
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

fn app_messages_read_model_error(error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error(
            "5000",
            format!("app messages read model is unavailable: {error}"),
        )),
    )
        .into_response()
}
