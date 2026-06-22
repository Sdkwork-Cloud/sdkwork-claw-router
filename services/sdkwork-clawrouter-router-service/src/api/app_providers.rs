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
    AppProviderItem, AppProvidersItems, AppProvidersReadFuture, AppProvidersReadStore,
    AppProvidersSubject,
};

#[derive(Clone)]
struct AppProvidersState {
    read_store: Arc<dyn AppProvidersReadStore + Send + Sync>,
    require_subject: bool,
}

struct EmptyAppProvidersReadStore;

impl AppProvidersReadStore for EmptyAppProvidersReadStore {
    fn load_providers<'a>(
        &'a self,
        _subject: Option<AppProvidersSubject>,
    ) -> AppProvidersReadFuture<'a, Vec<AppProviderItem>> {
        Box::pin(async { Ok(Vec::new()) })
    }
}

pub fn app_providers_router() -> Router {
    app_providers_router_with_state(Arc::new(EmptyAppProvidersReadStore), false)
}

pub fn app_providers_router_with_read_store(
    read_store: Arc<dyn AppProvidersReadStore + Send + Sync>,
) -> Router {
    app_providers_router_with_state(read_store, true)
}

fn app_providers_router_with_state(
    read_store: Arc<dyn AppProvidersReadStore + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route("/app/v3/api/ai/providers", get(fetch_providers))
        .with_state(AppProvidersState {
            read_store,
            require_subject,
        })
}

async fn fetch_providers(
    State(state): State<AppProvidersState>,
    subject: Option<TrustedRequestSubject>,
) -> Response {
    let subject = match providers_subject(subject, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_providers(subject).await {
        Ok(items) => Json(PlusApiResult::success(AppProvidersItems::new(items))).into_response(),
        Err(error) => app_providers_read_model_error(error),
    }
}

fn providers_subject(
    subject: Option<TrustedRequestSubject>,
    require_subject: bool,
) -> Result<Option<AppProvidersSubject>, Response> {
    map_optional_app_user_subject(subject, require_subject, |trusted| AppProvidersSubject {
        tenant_id: trusted.tenant_id,
        organization_id: trusted.organization_id,
        user_id: trusted.user_id,
    })
}

fn app_providers_read_model_error(error: impl std::fmt::Display) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error(
            "5000",
            format!("app providers read model is unavailable: {error}"),
        )),
    )
        .into_response()
}
