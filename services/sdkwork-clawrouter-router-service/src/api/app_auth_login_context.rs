use axum::extract::State;
use axum::http::HeaderMap;
use axum::response::{IntoResponse, Response};
use axum::routing::post;
use axum::{Json, Router};
use serde::Deserialize;
use serde_json::{json, Value};

use super::{
    app_session_request_id_error, auth_error_response, issue_iam_session, AppAuthState,
    AppSessionCreateError, IamSessionResponse, IamUserResponse,
};
use crate::api::request_id::generate_server_request_id;
use crate::api::response::PlusApiResult;
use crate::ports::{
    AppAuthUserCredential, AppOrganizationMembership, LoginContinuationRecord,
    StoreLoginContinuationCommand, LOGIN_CONTINUATION_TTL_SECONDS,
};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct IamLoginContextSelectionRequest {
    continuation_token: Option<String>,
    login_scope: Option<String>,
    organization_id: Option<String>,
}

pub(super) fn login_context_selection_routes() -> Router<AppAuthState> {
    Router::new()
        .route(
            "/app/v3/api/auth/sessions/login_context_selection",
            post(create_session_login_context_selection),
        )
        .route(
            "/app/v3/api/auth/sessions/organization_selection",
            post(create_session_organization_selection),
        )
}

pub(super) async fn authenticated_session_or_login_context_challenge(
    state: &AppAuthState,
    user: AppAuthUserCredential,
    auth_level: &str,
    request_id: Option<String>,
) -> Result<IamAuthOutcome, AppSessionCreateError> {
    let memberships = state
        .auth_store
        .list_active_organization_memberships(user.tenant_id, user.id)
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    if memberships.is_empty() {
        return Ok(IamAuthOutcome::Session(
            issue_iam_session(state, user.into(), auth_level, request_id).await?,
        ));
    }

    Ok(IamAuthOutcome::Challenge(
        build_login_context_selection_challenge(state, user, memberships, auth_level).await?,
    ))
}

#[derive(Debug, Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(super) struct IamLoginContextChallengeResponse {
    pub access_token: Option<String>,
    pub auth_token: Option<String>,
    pub refresh_token: Option<String>,
    pub challenge_type: String,
    pub continuation_token: String,
    pub expires_at: String,
    pub user: IamUserResponse,
    pub options: Vec<Value>,
    pub organizations: Vec<Value>,
}

pub(super) enum IamAuthOutcome {
    Session(IamSessionResponse),
    Challenge(IamLoginContextChallengeResponse),
}

impl IamAuthOutcome {
    pub(super) fn into_response(self) -> Response {
        match self {
            Self::Session(session) => Json(PlusApiResult::success(session)).into_response(),
            Self::Challenge(challenge) => Json(PlusApiResult::success(challenge)).into_response(),
        }
    }
}

async fn create_session_login_context_selection(
    State(state): State<AppAuthState>,
    headers: HeaderMap,
    Json(request): Json<IamLoginContextSelectionRequest>,
) -> Response {
    match create_session_login_context_selection_inner(state, headers, request, false).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(error) => auth_error_response(error),
    }
}

async fn create_session_organization_selection(
    State(state): State<AppAuthState>,
    headers: HeaderMap,
    Json(mut request): Json<IamLoginContextSelectionRequest>,
) -> Response {
    if request.login_scope.is_none() {
        request.login_scope = Some("ORGANIZATION".to_owned());
    }
    match create_session_login_context_selection_inner(state, headers, request, true).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(error) => auth_error_response(error),
    }
}

async fn create_session_login_context_selection_inner(
    state: AppAuthState,
    headers: HeaderMap,
    request: IamLoginContextSelectionRequest,
    organization_alias: bool,
) -> Result<IamSessionResponse, AppSessionCreateError> {
    reject_login_credential_headers(&headers)?;
    let continuation_token = request
        .continuation_token
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .ok_or_else(|| {
            AppSessionCreateError::BadRequest("continuationToken is required".to_owned())
        })?;
    let rate_limit_key = format!(
        "auth:login_context:{}",
        &continuation_token[..continuation_token.len().min(16)]
    );
    state
        .auth_sensitive_rate_limiter
        .check_and_record(&rate_limit_key)
        .await
        .map_err(AppSessionCreateError::TooManyRequests)?;

    let login_scope = request
        .login_scope
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(|value| value.to_ascii_uppercase())
        .ok_or_else(|| AppSessionCreateError::BadRequest("loginScope is required".to_owned()))?;

    if organization_alias && login_scope != "ORGANIZATION" {
        return Err(AppSessionCreateError::BadRequest(
            "organization selection requires loginScope ORGANIZATION".to_owned(),
        ));
    }

    let continuation = state
        .login_continuation_store
        .take_login_continuation(continuation_token)
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?
        .ok_or(AppSessionCreateError::Unauthorized)?;

    let now = current_unix_seconds();
    if continuation.expires_at_unix < now {
        return Err(AppSessionCreateError::Unauthorized);
    }

    let organization_id = match login_scope.as_str() {
        "TENANT" => 0,
        "ORGANIZATION" => {
            let organization_id = request
                .organization_id
                .as_deref()
                .map(str::trim)
                .filter(|value| !value.is_empty())
                .ok_or_else(|| {
                    AppSessionCreateError::BadRequest(
                        "organizationId is required for organization login".to_owned(),
                    )
                })?
                .parse::<i64>()
                .map_err(|_| {
                    AppSessionCreateError::BadRequest("organizationId must be numeric".to_owned())
                })?;
            if organization_id <= 0 {
                return Err(AppSessionCreateError::BadRequest(
                    "organizationId must be greater than zero".to_owned(),
                ));
            }
            if !continuation.organization_ids.contains(&organization_id) {
                return Err(AppSessionCreateError::BadRequest(
                    "organization is not available for current user".to_owned(),
                ));
            }
            organization_id
        }
        _ => {
            return Err(AppSessionCreateError::BadRequest(
                "loginScope must be TENANT or ORGANIZATION".to_owned(),
            ));
        }
    };

    let Some(mut user) = state
        .auth_store
        .find_user_by_id(continuation.tenant_id, continuation.user_id)
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?
    else {
        return Err(AppSessionCreateError::Unauthorized);
    };
    user.organization_id = organization_id;

    let request_id = generate_server_request_id()
        .map(Some)
        .map_err(app_session_request_id_error)?;
    issue_iam_session(&state, user.into(), &continuation.auth_level, request_id).await
}

async fn build_login_context_selection_challenge(
    state: &AppAuthState,
    user: AppAuthUserCredential,
    memberships: Vec<AppOrganizationMembership>,
    auth_level: &str,
) -> Result<IamLoginContextChallengeResponse, AppSessionCreateError> {
    let continuation_token = state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    let continuation_token = format!("lc_{continuation_token}");
    let expires_at_unix = current_unix_seconds() + LOGIN_CONTINUATION_TTL_SECONDS;
    let organization_ids = memberships
        .iter()
        .map(|membership| membership.organization_id)
        .collect::<Vec<_>>();
    state
        .login_continuation_store
        .store_login_continuation(StoreLoginContinuationCommand {
            token: continuation_token.clone(),
            record: LoginContinuationRecord {
                tenant_id: user.tenant_id,
                user_id: user.id,
                organization_ids,
                auth_level: auth_level.to_owned(),
                expires_at_unix,
            },
        })
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;

    let organizations = memberships
        .iter()
        .map(|membership| {
            json!({
                "id": membership.organization_id.to_string(),
                "organizationId": membership.organization_id.to_string(),
                "code": membership.organization_code,
                "name": membership.organization_name,
                "membershipId": membership.id,
                "membershipKind": membership.membership_kind,
                "primary": membership.is_primary,
            })
        })
        .collect();

    Ok(IamLoginContextChallengeResponse {
        access_token: None,
        auth_token: None,
        refresh_token: None,
        challenge_type: "LOGIN_CONTEXT_SELECTION".to_owned(),
        continuation_token,
        expires_at: expires_at_unix.to_string(),
        user: user.into(),
        options: vec![
            json!({
                "loginScope": "TENANT",
                "organizationId": "0",
                "displayName": "Personal account"
            }),
            json!({
                "loginScope": "ORGANIZATION",
                "requiresOrganizationSelection": true
            }),
        ],
        organizations,
    })
}

pub(super) fn reject_login_credential_headers(
    headers: &HeaderMap,
) -> Result<(), AppSessionCreateError> {
    const BLOCKED: &[&str] = &["authorization", "access-token", "x-access-token"];
    for name in BLOCKED {
        if headers.contains_key(*name) {
            return Err(AppSessionCreateError::BadRequest(format!(
                "{name} must not be sent to credential-entry auth endpoints"
            )));
        }
    }
    Ok(())
}

fn current_unix_seconds() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}
