use std::sync::Arc;

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;

use crate::api::response::PlusApiResult;
use crate::ports::{
    AppUserProfileReadFuture, AppUserProfileReadStore, AppUserProfileSnapshot,
    AppUserProfileSubject,
};

#[derive(Clone)]
struct AppUserProfileState {
    read_store: Arc<dyn AppUserProfileReadStore + Send + Sync>,
    require_subject: bool,
}

struct EmptyAppUserProfileReadStore;

impl AppUserProfileReadStore for EmptyAppUserProfileReadStore {
    fn load_user_profile<'a>(
        &'a self,
        _subject: Option<AppUserProfileSubject>,
    ) -> AppUserProfileReadFuture<'a> {
        Box::pin(async { Ok(AppUserProfileSnapshot::default()) })
    }
}

pub fn app_user_profile_router() -> Router {
    app_user_profile_router_with_state(Arc::new(EmptyAppUserProfileReadStore), false)
}

pub fn app_user_profile_router_with_read_store(
    read_store: Arc<dyn AppUserProfileReadStore + Send + Sync>,
) -> Router {
    app_user_profile_router_with_state(read_store, true)
}

fn app_user_profile_router_with_state(
    read_store: Arc<dyn AppUserProfileReadStore + Send + Sync>,
    require_subject: bool,
) -> Router {
    Router::new()
        .route("/app/v3/api/iam/users/current", get(fetch_user_profile))
        .with_state(AppUserProfileState {
            read_store,
            require_subject,
        })
}

async fn fetch_user_profile(
    State(state): State<AppUserProfileState>,
    headers: HeaderMap,
) -> Response {
    let subject = match require_subject(&headers, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state.read_store.load_user_profile(subject).await {
        Ok(snapshot) => Json(PlusApiResult::success(snapshot)).into_response(),
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(PlusApiResult::error(
                "5000",
                format!("app user profile read model is unavailable: {error}"),
            )),
        )
            .into_response(),
    }
}

fn require_subject(
    headers: &HeaderMap,
    require_subject: bool,
) -> Result<Option<AppUserProfileSubject>, Response> {
    match TrustedRequestSubject::from_headers(headers) {
        Ok(subject) => Ok(Some(AppUserProfileSubject {
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
