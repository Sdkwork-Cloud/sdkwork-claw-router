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
    subject: Option<TrustedRequestSubject>,
) -> Response {
    let subject = match user_profile_subject(subject, state.require_subject) {
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

fn user_profile_subject(
    subject: Option<TrustedRequestSubject>,
    require_subject: bool,
) -> Result<Option<AppUserProfileSubject>, Response> {
    map_optional_app_user_subject(subject, require_subject, |trusted| AppUserProfileSubject {
        tenant_id: trusted.tenant_id,
        organization_id: trusted.organization_id,
        user_id: trusted.user_id,
    })
}
