use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::post;
use axum::{Json, Router};
use sdkwork_claw_config::AppSessionConfig;
use sdkwork_claw_http::{sign_app_session_token, TrustedRequestSubject};
use serde::Serialize;
use sha2::{Digest, Sha256};

use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::ports::{AppSessionEventStore, RecordAppSessionIssuedEventCommand};

const REQUEST_ID_HEADER: &str = "X-Request-Id";

struct AppSessionState {
    app_session_config: AppSessionConfig,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
}

impl Clone for AppSessionState {
    fn clone(&self) -> Self {
        Self {
            app_session_config: self.app_session_config.clone(),
            event_store: Arc::clone(&self.event_store),
            entity_uuid_generator: Arc::clone(&self.entity_uuid_generator),
        }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppSessionCreateResponse {
    token: String,
    token_type: &'static str,
    expires_at: i64,
    expires_in_seconds: u64,
}

pub fn app_session_router_with_event_store(
    app_session_config: AppSessionConfig,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    Router::new()
        .route("/app/v3/api/auth/session", post(create_app_session))
        .with_state(AppSessionState {
            app_session_config,
            event_store,
            entity_uuid_generator,
        })
}

async fn create_app_session(State(state): State<AppSessionState>, headers: HeaderMap) -> Response {
    match create_app_session_inner(state, headers).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(AppSessionCreateError::Unauthorized(message)) => (
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", message)),
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
) -> Result<AppSessionCreateResponse, AppSessionCreateError> {
    let subject = TrustedRequestSubject::from_headers(&headers)
        .map_err(|error| AppSessionCreateError::Unauthorized(error.to_string()))?;
    let request_id = normalize_request_id(&headers)?;
    let issued_at = current_unix_seconds();
    let expires_at = expires_at(&state.app_session_config, issued_at)?;
    let token = sign_app_session_token(&state.app_session_config, subject, issued_at, expires_at);
    let session_id_hash = sha256_hex(&token);
    let event_uuid = state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;

    state
        .event_store
        .record_app_session_issued(RecordAppSessionIssuedEventCommand {
            event_uuid,
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            user_id: subject.user_id,
            request_id,
            auth_provider: None,
            session_id_hash,
        })
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;

    Ok(AppSessionCreateResponse {
        token,
        token_type: "Bearer",
        expires_at,
        expires_in_seconds: state.app_session_config.session_ttl_seconds(),
    })
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum AppSessionCreateError {
    Unauthorized(String),
    BadRequest(String),
    System(String),
}

fn normalize_request_id(headers: &HeaderMap) -> Result<Option<String>, AppSessionCreateError> {
    let Some(value) = headers.get(REQUEST_ID_HEADER) else {
        return Ok(None);
    };
    let value = value
        .to_str()
        .map_err(|_| {
            AppSessionCreateError::BadRequest("X-Request-Id header is invalid".to_owned())
        })?
        .trim();
    if value.is_empty() {
        return Ok(None);
    }
    if value.len() > 128 {
        return Err(AppSessionCreateError::BadRequest(
            "X-Request-Id header must be at most 128 characters".to_owned(),
        ));
    }
    Ok(Some(value.to_owned()))
}

fn expires_at(config: &AppSessionConfig, issued_at: i64) -> Result<i64, AppSessionCreateError> {
    let ttl = i64::try_from(config.session_ttl_seconds())
        .map_err(|_| AppSessionCreateError::System("app session ttl is too large".to_owned()))?;
    issued_at.checked_add(ttl).ok_or_else(|| {
        AppSessionCreateError::System("app session expiration overflowed".to_owned())
    })
}

fn current_unix_seconds() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}

fn sha256_hex(value: &str) -> String {
    hex::encode(Sha256::digest(value.as_bytes()))
}
