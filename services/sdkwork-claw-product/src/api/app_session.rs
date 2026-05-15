use std::sync::Arc;

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::post;
use axum::{Json, Router};
use sdkwork_claw_config::AppSessionConfig;
use sdkwork_claw_http::TrustedRequestSubject;
use serde::Deserialize;

use crate::api::app_auth::{
    issue_iam_session, normalize_language, normalize_request_id, AppSessionCreateError,
    IamSessionIssueUser,
};
use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::ports::AppSessionEventStore;

const APP_SESSION_PATH: &str = "/app/v3/api/auth/sessions";

#[derive(Clone)]
struct AppSessionState {
    app_session_config: AppSessionConfig,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct IamSessionBridgeRequest {
    grant_type: Option<String>,
}

pub fn app_session_router_with_event_store(
    app_session_config: AppSessionConfig,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    Router::new()
        .route(APP_SESSION_PATH, post(create_app_session))
        .with_state(AppSessionState {
            app_session_config,
            event_store,
            entity_uuid_generator,
        })
}

async fn create_app_session(
    State(state): State<AppSessionState>,
    headers: HeaderMap,
    Json(request): Json<IamSessionBridgeRequest>,
) -> Response {
    match create_app_session_inner(state, headers, request).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(AppSessionCreateError::Unauthorized) => (
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error(
                "4010",
                "trusted request subject is required",
            )),
        )
            .into_response(),
        Err(AppSessionCreateError::TrustedSubjectRequired) => (
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error(
                "4010",
                "trusted request subject is required",
            )),
        )
            .into_response(),
        Err(AppSessionCreateError::BadRequest(message)) => (
            StatusCode::BAD_REQUEST,
            Json(PlusApiResult::error("4001", message)),
        )
            .into_response(),
        Err(AppSessionCreateError::System(message)) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(PlusApiResult::error("5000", message)),
        )
            .into_response(),
    }
}

async fn create_app_session_inner(
    state: AppSessionState,
    headers: HeaderMap,
    request: IamSessionBridgeRequest,
) -> Result<crate::api::app_auth::IamSessionResponse, AppSessionCreateError> {
    let grant_type = request
        .grant_type
        .as_deref()
        .map(|value| value.trim().replace('-', "_").to_ascii_lowercase())
        .unwrap_or_else(|| "session_bridge".to_owned());
    if grant_type != "session_bridge" {
        return Err(AppSessionCreateError::BadRequest(format!(
            "grantType {grant_type} is not supported by this endpoint"
        )));
    }
    let request_id = normalize_request_id(&headers)?;
    create_session_bridge_response(
        &state.app_session_config,
        state.event_store.as_ref(),
        state.entity_uuid_generator.as_ref(),
        &headers,
        request_id,
    )
    .await
}

pub(crate) async fn create_session_bridge_response(
    app_session_config: &AppSessionConfig,
    event_store: &(dyn AppSessionEventStore + Send + Sync),
    entity_uuid_generator: &(dyn EntityUuidGenerator + Send + Sync),
    headers: &HeaderMap,
    request_id: Option<String>,
) -> Result<crate::api::app_auth::IamSessionResponse, AppSessionCreateError> {
    let subject = TrustedRequestSubject::from_headers(headers)
        .map_err(|_| AppSessionCreateError::TrustedSubjectRequired)?;
    let user = IamSessionIssueUser {
        id: subject.user_id,
        tenant_id: subject.tenant_id,
        organization_id: subject.organization_id,
        username: format!("user-{}", subject.user_id),
        display_name: format!("SDKWork User {}", subject.user_id),
        email: String::new(),
        avatar_url: String::new(),
        phone: String::new(),
        language: normalize_language(String::new()),
        is_verified: true,
        status: "active".to_owned(),
        registered_at: String::new(),
        last_login: String::new(),
        last_login_ip: String::new(),
        password_last_changed: String::new(),
        two_factor_enabled: false,
        third_party_bound: String::new(),
    };

    issue_iam_session(
        app_session_config,
        event_store,
        entity_uuid_generator,
        user,
        "system",
        request_id,
    )
    .await
}
