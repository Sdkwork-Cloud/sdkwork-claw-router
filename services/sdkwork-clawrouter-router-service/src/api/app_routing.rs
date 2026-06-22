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
    AppRoutingApiKeyItem, AppRoutingChannelItem, AppRoutingItems, AppRoutingReadFuture,
    AppRoutingReadStore, AppRoutingRequestTraceItem, AppRoutingSubject, AppRoutingUsageSnapshot,
};

#[derive(Clone)]
struct AppRoutingState {
    read_store: Arc<dyn AppRoutingReadStore + Send + Sync>,
    require_subject: bool,
}

struct EmptyAppRoutingReadStore;

impl AppRoutingReadStore for EmptyAppRoutingReadStore {
    fn load_routing_channels<'a>(
        &'a self,
        _subject: Option<AppRoutingSubject>,
    ) -> AppRoutingReadFuture<'a, Vec<AppRoutingChannelItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn load_routing_api_keys<'a>(
        &'a self,
        _subject: Option<AppRoutingSubject>,
    ) -> AppRoutingReadFuture<'a, Vec<AppRoutingApiKeyItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn load_routing_request_traces<'a>(
        &'a self,
        _subject: Option<AppRoutingSubject>,
    ) -> AppRoutingReadFuture<'a, Vec<AppRoutingRequestTraceItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }

    fn load_routing_usage<'a>(
        &'a self,
        _subject: Option<AppRoutingSubject>,
    ) -> AppRoutingReadFuture<'a, AppRoutingUsageSnapshot> {
        Box::pin(async { Ok(AppRoutingUsageSnapshot::default()) })
    }
}

pub fn app_routing_router() -> Router {
    app_routing_router_with_state(Arc::new(EmptyAppRoutingReadStore), false)
}

pub fn app_routing_router_with_read_store(
    read_store: Arc<dyn AppRoutingReadStore + Send + Sync>,
) -> Router {
    app_routing_router_with_state(read_store, true)
}

fn app_routing_router_with_state(
    read_store: Arc<dyn AppRoutingReadStore + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route(
            "/app/v3/api/ai/routing/channels",
            get(fetch_routing_channels),
        )
        .route(
            "/app/v3/api/ai/routing/api_keys",
            get(fetch_routing_api_keys),
        )
        .route(
            "/app/v3/api/ai/routing/request_traces",
            get(fetch_routing_request_traces),
        )
        .route("/app/v3/api/ai/routing/usage", get(fetch_routing_usage))
        .with_state(AppRoutingState {
            read_store,
            require_subject,
        })
}

async fn fetch_routing_channels(
    State(state): State<AppRoutingState>,
    subject: Option<TrustedRequestSubject>,
) -> Response {
    let subject = match routing_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_routing_channels(subject).await {
        Ok(items) => Json(PlusApiResult::success(AppRoutingItems::new(items))).into_response(),
        Err(error) => app_routing_read_model_error(error),
    }
}

async fn fetch_routing_api_keys(
    State(state): State<AppRoutingState>,
    subject: Option<TrustedRequestSubject>,
) -> Response {
    let subject = match routing_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_routing_api_keys(subject).await {
        Ok(items) => Json(PlusApiResult::success(AppRoutingItems::new(items))).into_response(),
        Err(error) => app_routing_read_model_error(error),
    }
}

async fn fetch_routing_request_traces(
    State(state): State<AppRoutingState>,
    subject: Option<TrustedRequestSubject>,
) -> Response {
    let subject = match routing_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_routing_request_traces(subject).await {
        Ok(items) => Json(PlusApiResult::success(AppRoutingItems::new(items))).into_response(),
        Err(error) => app_routing_read_model_error(error),
    }
}

async fn fetch_routing_usage(
    State(state): State<AppRoutingState>,
    subject: Option<TrustedRequestSubject>,
) -> Response {
    let subject = match routing_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_routing_usage(subject).await {
        Ok(snapshot) => Json(PlusApiResult::success(snapshot)).into_response(),
        Err(error) => app_routing_read_model_error(error),
    }
}

fn routing_subject(
    subject: Option<TrustedRequestSubject>,
    require_subject: bool,
) -> Result<Option<AppRoutingSubject>, Response> {
    map_optional_app_user_subject(subject, require_subject, |trusted| AppRoutingSubject {
        tenant_id: trusted.tenant_id,
        organization_id: trusted.organization_id,
        user_id: trusted.user_id,
    })
}

fn app_routing_read_model_error(error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error(
            "5000",
            format!("app routing read model is unavailable: {error}"),
        )),
    )
        .into_response()
}
