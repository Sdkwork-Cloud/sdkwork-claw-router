use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::post;
use axum::{Json, Router};
use sdkwork_claw_config::AppSessionConfig;
use sdkwork_claw_http::{sign_app_session_token, TrustedRequestSubject};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::api::response::PlusApiResult;
use crate::application::{EntityUuidGenerator, PasswordHasher};
use crate::ports::{
    AppAuthStore, AppAuthUserCredential, AppSessionEventStore, RecordAppSessionIssuedEventCommand,
};

const REQUEST_ID_HEADER: &str = "X-Request-Id";
const USER_STATUS_ACTIVE: i64 = 1;
const INVALID_CREDENTIALS_MESSAGE: &str = "Invalid account or password";
const MAX_ACCOUNT_LENGTH: usize = 128;
const MAX_PASSWORD_LENGTH: usize = 128;

#[derive(Clone)]
struct AppAuthState {
    auth_store: Arc<dyn AppAuthStore + Send + Sync>,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    app_session_config: AppSessionConfig,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppPasswordLoginRequest {
    username: String,
    password: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppPasswordLoginResponse {
    token: String,
    token_type: &'static str,
    expires_at: i64,
    expires_in_seconds: u64,
    user: AppPasswordLoginUser,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppPasswordLoginUser {
    id: i64,
    username: String,
    email: String,
    name: String,
    avatar: String,
}

pub fn app_auth_router_with_store(
    auth_store: Arc<dyn AppAuthStore + Send + Sync>,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    app_session_config: AppSessionConfig,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
) -> Router {
    Router::new()
        .route("/app/v3/api/auth/login", post(login))
        .with_state(AppAuthState {
            auth_store,
            event_store,
            entity_uuid_generator,
            app_session_config,
            password_hasher,
        })
}

async fn login(
    State(state): State<AppAuthState>,
    headers: HeaderMap,
    Json(request): Json<AppPasswordLoginRequest>,
) -> Response {
    match login_inner(state, headers, request).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(AppPasswordLoginError::Unauthorized) => (
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", INVALID_CREDENTIALS_MESSAGE)),
        )
            .into_response(),
        Err(AppPasswordLoginError::BadRequest(message)) => (
            StatusCode::BAD_REQUEST,
            Json(PlusApiResult::error("4001", message)),
        )
            .into_response(),
        Err(AppPasswordLoginError::System(message)) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(PlusApiResult::error("5000", message)),
        )
            .into_response(),
    }
}

async fn login_inner(
    state: AppAuthState,
    headers: HeaderMap,
    request: AppPasswordLoginRequest,
) -> Result<AppPasswordLoginResponse, AppPasswordLoginError> {
    let account = normalize_required_field("username", &request.username, MAX_ACCOUNT_LENGTH)?;
    let password = normalize_required_field("password", &request.password, MAX_PASSWORD_LENGTH)?;
    let request_id = normalize_request_id(&headers)?;
    let Some(user) = state
        .auth_store
        .find_user_for_password_login(&account)
        .await
        .map_err(|error| AppPasswordLoginError::System(error.to_string()))?
    else {
        return Err(AppPasswordLoginError::Unauthorized);
    };

    if user.status != USER_STATUS_ACTIVE {
        return Err(AppPasswordLoginError::Unauthorized);
    }

    let verified = state
        .password_hasher
        .verify_password(&password, &user.password_hash)
        .map_err(|error| AppPasswordLoginError::System(error.to_string()))?;
    if !verified {
        return Err(AppPasswordLoginError::Unauthorized);
    }

    issue_session(state, user, request_id).await
}

async fn issue_session(
    state: AppAuthState,
    user: AppAuthUserCredential,
    request_id: Option<String>,
) -> Result<AppPasswordLoginResponse, AppPasswordLoginError> {
    let issued_at = current_unix_seconds();
    let expires_at = expires_at(&state.app_session_config, issued_at)?;
    let subject = TrustedRequestSubject {
        tenant_id: user.tenant_id,
        organization_id: user.organization_id,
        user_id: user.id,
        operator_id: user.id,
        operator_type: 1,
    };
    let token = sign_app_session_token(&state.app_session_config, subject, issued_at, expires_at);
    let session_id_hash = sha256_hex(&token);
    let event_uuid = state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(|error| AppPasswordLoginError::System(error.to_string()))?;
    state
        .event_store
        .record_app_session_issued(RecordAppSessionIssuedEventCommand {
            event_uuid,
            tenant_id: user.tenant_id,
            organization_id: user.organization_id,
            user_id: user.id,
            request_id,
            auth_provider: Some("password".to_owned()),
            session_id_hash,
        })
        .await
        .map_err(|error| AppPasswordLoginError::System(error.to_string()))?;

    Ok(AppPasswordLoginResponse {
        token,
        token_type: "Bearer",
        expires_at,
        expires_in_seconds: state.app_session_config.session_ttl_seconds(),
        user: AppPasswordLoginUser {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
        },
    })
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum AppPasswordLoginError {
    Unauthorized,
    BadRequest(String),
    System(String),
}

fn normalize_required_field(
    name: &str,
    value: &str,
    max_len: usize,
) -> Result<String, AppPasswordLoginError> {
    let normalized = value.trim();
    if normalized.is_empty() {
        return Err(AppPasswordLoginError::BadRequest(format!(
            "{name} must not be empty"
        )));
    }
    if normalized.len() > max_len {
        return Err(AppPasswordLoginError::BadRequest(format!(
            "{name} must be at most {max_len} characters"
        )));
    }
    Ok(normalized.to_owned())
}

fn normalize_request_id(headers: &HeaderMap) -> Result<Option<String>, AppPasswordLoginError> {
    let Some(value) = headers.get(REQUEST_ID_HEADER) else {
        return Ok(None);
    };
    let value = value
        .to_str()
        .map_err(|_| {
            AppPasswordLoginError::BadRequest("X-Request-Id header is invalid".to_owned())
        })?
        .trim();
    if value.is_empty() {
        return Ok(None);
    }
    if value.len() > 128 {
        return Err(AppPasswordLoginError::BadRequest(
            "X-Request-Id header must be at most 128 characters".to_owned(),
        ));
    }
    Ok(Some(value.to_owned()))
}

fn expires_at(config: &AppSessionConfig, issued_at: i64) -> Result<i64, AppPasswordLoginError> {
    let ttl = i64::try_from(config.session_ttl_seconds())
        .map_err(|_| AppPasswordLoginError::System("app session ttl is too large".to_owned()))?;
    issued_at.checked_add(ttl).ok_or_else(|| {
        AppPasswordLoginError::System("app session expiration overflowed".to_owned())
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
