use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::middleware::from_fn_with_state;
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use sdkwork_claw_config::{AppSessionConfig, TrustedSubjectConfig};
use sdkwork_claw_http::{sign_app_session_token, TrustedRequestSubject};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::api::response::PlusApiResult;
use crate::application::{EntityUuidGenerator, PasswordHasher};
use crate::ports::{
    AdminAuthSettings, AdminAuthSettingsStore, AppAuthPasswordResetCodeCommand,
    AppAuthPasswordResetCommand, AppAuthRegistrationCommand, AppAuthStore, AppAuthUserCredential,
    AppAuthVerificationCodeCommand, AppAuthVerificationCodeLookup, AppSessionEventStore,
    DebugVerificationCodeSender, GetAdminAuthSettingsScopeQuery,
    RecordAppSessionIssuedEventCommand, VerificationCodeDeliveryRequest, VerificationCodeSender,
};

const APP_ID: &str = "sdkwork-claw-router";
const APP_SESSION_PATH: &str = "/app/v3/api/auth/sessions";
const DEPLOYMENT_MODE: &str = "local";
const ENVIRONMENT: &str = "dev";
const REQUEST_ID_HEADER: &str = "X-Request-Id";
const INVALID_CREDENTIALS_MESSAGE: &str = "Invalid account or password";
const INVALID_CODE_MESSAGE: &str = "Invalid or expired verification code";
const MAX_ACCOUNT_LENGTH: usize = 128;
const MAX_PASSWORD_LENGTH: usize = 128;
const MAX_CODE_LENGTH: usize = 32;
const MAX_EMAIL_LENGTH: usize = 256;
const MAX_PHONE_LENGTH: usize = 32;
const MAX_CODE_TARGET_LENGTH: usize = 256;
const MAX_TENANT_CODE_LENGTH: usize = 64;
const MAX_ORGANIZATION_CODE_LENGTH: usize = 64;
const VERIFICATION_CODE_TTL_SECONDS: i64 = 300;
const PASSWORD_RESET_CODE_TTL_SECONDS: i64 = 900;
const LOGIN_QR_CODE_TTL_SECONDS: i64 = 300;
const LOCAL_DEBUG_VERIFICATION_CODE: &str = "666666";

#[derive(Clone)]
struct AppAuthState {
    auth_store: Arc<dyn AppAuthStore + Send + Sync>,
    auth_settings_store: Option<Arc<dyn AdminAuthSettingsStore + Send + Sync>>,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    verification_code_sender: Arc<dyn VerificationCodeSender + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    app_session_config: AppSessionConfig,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
    expose_debug_code: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct IamSessionCreateRequest {
    grant_type: Option<String>,
    username: Option<String>,
    password: Option<String>,
    email: Option<String>,
    phone: Option<String>,
    code: Option<String>,
    tenant_code: Option<String>,
    organization_code: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct IamRegistrationCreateRequest {
    username: String,
    password: String,
    confirm_password: Option<String>,
    email: Option<String>,
    phone: Option<String>,
    channel: Option<String>,
    verification_code: Option<String>,
    tenant_code: Option<String>,
    organization_code: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct IamVerificationCodeCreateRequest {
    target: String,
    scene: String,
    verify_type: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct IamVerificationCodeVerifyRequest {
    code_id: Option<String>,
    target: String,
    scene: String,
    verify_type: String,
    code: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct IamPasswordResetRequestCreateRequest {
    account: String,
    channel: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct IamPasswordResetCreateRequest {
    account: String,
    code: String,
    new_password: String,
    confirm_password: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct IamOauthSessionCreateRequest {
    provider: String,
    code: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct IamOauthAuthorizationUrlQuery {
    provider: String,
    redirect_uri: String,
    state: Option<String>,
    scope: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "snake_case")]
struct IamRuntimeSettingsQuery {
    tenant_code: Option<String>,
    organization_code: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct IamLoginQrCodeResponse {
    qr_key: String,
    qr_content: String,
    title: String,
    description: String,
    r#type: String,
    expire_time: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct IamLoginQrCodeStatusResponse {
    status: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct IamRuntimeAuthSettingsResponse {
    left_rail_mode: String,
    login_methods: Vec<String>,
    oauth_login_enabled: bool,
    oauth_providers: Vec<String>,
    oauth_region: String,
    qr_login_enabled: bool,
    recovery_methods: Vec<String>,
    register_methods: Vec<String>,
    verification_policy: IamRuntimeAuthVerificationPolicyResponse,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct IamRuntimeAuthVerificationPolicyResponse {
    email_code_login_enabled: bool,
    email_registration_verification_required: bool,
    phone_code_login_enabled: bool,
    phone_registration_verification_required: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct IamSessionResponse {
    pub access_token: String,
    pub auth_token: String,
    pub refresh_token: String,
    pub session_id: String,
    pub expires_at: String,
    pub context: IamAppContext,
    pub user: IamUserResponse,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct IamVerificationCodeResponse {
    code_id: String,
    expires_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    debug_code: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct IamVerificationCodeVerifyResponse {
    verified: bool,
    valid: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct IamPasswordResetRequestResponse {
    request_id: String,
    expires_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    debug_code: Option<String>,
}

#[derive(Debug, Serialize)]
struct NoData {}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct IamAppContext {
    pub app_id: String,
    pub auth_level: String,
    pub data_scope: Vec<String>,
    pub deployment_mode: String,
    pub environment: String,
    pub organization_id: String,
    pub permission_scope: Vec<String>,
    pub session_id: String,
    pub tenant_id: String,
    pub user_id: String,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub(crate) struct IamUserResponse {
    pub id: String,
    pub username: String,
    pub display_name: String,
    pub email: String,
    pub avatar_url: String,
    pub phone: String,
    pub language: String,
    pub is_verified: bool,
    pub status: String,
    pub registered_at: String,
    pub last_login: String,
    pub last_login_ip: String,
    pub password_last_changed: String,
    pub two_factor_enabled: bool,
    pub third_party_bound: String,
}

#[derive(Debug, Clone)]
pub(crate) struct IamSessionIssueUser {
    pub id: i64,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub username: String,
    pub display_name: String,
    pub email: String,
    pub avatar_url: String,
    pub phone: String,
    pub language: String,
    pub is_verified: bool,
    pub status: String,
    pub registered_at: String,
    pub last_login: String,
    pub last_login_ip: String,
    pub password_last_changed: String,
    pub two_factor_enabled: bool,
    pub third_party_bound: String,
}

impl From<AppAuthUserCredential> for IamSessionIssueUser {
    fn from(user: AppAuthUserCredential) -> Self {
        Self {
            id: user.id,
            tenant_id: user.tenant_id,
            organization_id: user.organization_id,
            username: user.username,
            display_name: user.display_name,
            email: user.email,
            avatar_url: user.avatar_url,
            phone: user.phone,
            language: normalize_language(user.language),
            is_verified: true,
            status: user.status,
            registered_at: user.registered_at,
            last_login: String::new(),
            last_login_ip: String::new(),
            password_last_changed: user.password_last_changed,
            two_factor_enabled: user.two_factor_enabled,
            third_party_bound: user.third_party_bound,
        }
    }
}

pub fn app_auth_router_with_store(
    auth_store: Arc<dyn AppAuthStore + Send + Sync>,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    app_session_config: AppSessionConfig,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
) -> Router {
    app_auth_router_with_store_and_verification_sender(
        auth_store,
        event_store,
        entity_uuid_generator,
        app_session_config,
        password_hasher,
        Arc::new(DebugVerificationCodeSender),
        true,
    )
}

pub fn app_auth_router_with_store_and_verification_sender(
    auth_store: Arc<dyn AppAuthStore + Send + Sync>,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    app_session_config: AppSessionConfig,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
    verification_code_sender: Arc<dyn VerificationCodeSender + Send + Sync>,
    expose_debug_code: bool,
) -> Router {
    app_auth_router_with_store_auth_settings_store_and_verification_sender(
        auth_store,
        None,
        event_store,
        entity_uuid_generator,
        app_session_config,
        password_hasher,
        verification_code_sender,
        expose_debug_code,
    )
}

pub fn app_auth_router_with_store_auth_settings_store_and_verification_sender(
    auth_store: Arc<dyn AppAuthStore + Send + Sync>,
    auth_settings_store: Option<Arc<dyn AdminAuthSettingsStore + Send + Sync>>,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    app_session_config: AppSessionConfig,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
    verification_code_sender: Arc<dyn VerificationCodeSender + Send + Sync>,
    expose_debug_code: bool,
) -> Router {
    Router::new()
        .route(APP_SESSION_PATH, post(create_session))
        .route(
            "/app/v3/api/auth/qr_login_codes",
            post(create_login_qr_code),
        )
        .route(
            "/app/v3/api/auth/qr_login_codes/{qr_key}",
            get(retrieve_login_qr_code),
        )
        .route("/app/v3/api/auth/registrations", post(create_registration))
        .route(
            "/app/v3/api/auth/verification_codes",
            post(create_verification_code),
        )
        .route(
            "/app/v3/api/auth/verification_codes/verify",
            post(verify_code),
        )
        .route(
            "/app/v3/api/auth/password_reset_requests",
            post(create_password_reset_request),
        )
        .route(
            "/app/v3/api/auth/password_resets",
            post(create_password_reset),
        )
        .route(
            "/app/v3/api/auth/oauth_authorization_urls",
            get(oauth_authorization_url_not_configured),
        )
        .route(
            "/app/v3/api/auth/oauth_sessions",
            post(create_oauth_session),
        )
        .route(
            "/app/v3/api/auth/runtime_settings",
            get(retrieve_runtime_settings),
        )
        .with_state(AppAuthState {
            auth_store,
            auth_settings_store,
            event_store,
            verification_code_sender,
            entity_uuid_generator,
            app_session_config,
            password_hasher,
            expose_debug_code,
        })
}

pub fn app_sessions_router_with_store(
    auth_store: Option<Arc<dyn AppAuthStore + Send + Sync>>,
    auth_settings_store: Option<Arc<dyn AdminAuthSettingsStore + Send + Sync>>,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
) -> Router {
    Router::new()
        .route(APP_SESSION_PATH, post(create_session))
        .route(
            "/app/v3/api/auth/qr_login_codes",
            post(create_login_qr_code),
        )
        .route(
            "/app/v3/api/auth/qr_login_codes/{qr_key}",
            get(retrieve_login_qr_code),
        )
        .route("/app/v3/api/auth/registrations", post(create_registration))
        .route(
            "/app/v3/api/auth/verification_codes",
            post(create_verification_code),
        )
        .route(
            "/app/v3/api/auth/verification_codes/verify",
            post(verify_code),
        )
        .route(
            "/app/v3/api/auth/password_reset_requests",
            post(create_password_reset_request),
        )
        .route(
            "/app/v3/api/auth/password_resets",
            post(create_password_reset),
        )
        .route(
            "/app/v3/api/auth/oauth_authorization_urls",
            get(oauth_authorization_url_not_configured),
        )
        .route(
            "/app/v3/api/auth/oauth_sessions",
            post(create_oauth_session),
        )
        .route(
            "/app/v3/api/auth/runtime_settings",
            get(retrieve_runtime_settings),
        )
        .with_state(AppAuthState {
            auth_store: auth_store.unwrap_or_else(|| Arc::new(UnconfiguredAppAuthStore)),
            auth_settings_store,
            event_store,
            verification_code_sender: Arc::new(DebugVerificationCodeSender),
            entity_uuid_generator,
            app_session_config,
            password_hasher,
            expose_debug_code: true,
        })
        .layer(from_fn_with_state(
            trusted_subject_config,
            sdkwork_claw_http::trusted_request_subject_boundary,
        ))
}

pub fn app_sessions_router_with_store_and_verification_sender(
    auth_store: Option<Arc<dyn AppAuthStore + Send + Sync>>,
    auth_settings_store: Option<Arc<dyn AdminAuthSettingsStore + Send + Sync>>,
    event_store: Arc<dyn AppSessionEventStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
    trusted_subject_config: TrustedSubjectConfig,
    app_session_config: AppSessionConfig,
    password_hasher: Arc<dyn PasswordHasher + Send + Sync>,
    verification_code_sender: Arc<dyn VerificationCodeSender + Send + Sync>,
    expose_debug_code: bool,
) -> Router {
    Router::new()
        .route(APP_SESSION_PATH, post(create_session))
        .route(
            "/app/v3/api/auth/qr_login_codes",
            post(create_login_qr_code),
        )
        .route(
            "/app/v3/api/auth/qr_login_codes/{qr_key}",
            get(retrieve_login_qr_code),
        )
        .route("/app/v3/api/auth/registrations", post(create_registration))
        .route(
            "/app/v3/api/auth/verification_codes",
            post(create_verification_code),
        )
        .route(
            "/app/v3/api/auth/verification_codes/verify",
            post(verify_code),
        )
        .route(
            "/app/v3/api/auth/password_reset_requests",
            post(create_password_reset_request),
        )
        .route(
            "/app/v3/api/auth/password_resets",
            post(create_password_reset),
        )
        .route(
            "/app/v3/api/auth/oauth_authorization_urls",
            get(oauth_authorization_url_not_configured),
        )
        .route(
            "/app/v3/api/auth/oauth_sessions",
            post(create_oauth_session),
        )
        .route(
            "/app/v3/api/auth/runtime_settings",
            get(retrieve_runtime_settings),
        )
        .with_state(AppAuthState {
            auth_store: auth_store.unwrap_or_else(|| Arc::new(UnconfiguredAppAuthStore)),
            auth_settings_store,
            event_store,
            verification_code_sender,
            entity_uuid_generator,
            app_session_config,
            password_hasher,
            expose_debug_code,
        })
        .layer(from_fn_with_state(
            trusted_subject_config,
            sdkwork_claw_http::trusted_request_subject_boundary,
        ))
}

async fn create_session(
    State(state): State<AppAuthState>,
    headers: HeaderMap,
    Json(request): Json<IamSessionCreateRequest>,
) -> Response {
    match create_session_inner(state, headers, request).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(AppSessionCreateError::Unauthorized) => (
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", INVALID_CREDENTIALS_MESSAGE)),
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

async fn create_login_qr_code(State(state): State<AppAuthState>) -> Response {
    match create_login_qr_code_inner(state).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(error) => auth_error_response(error),
    }
}

async fn create_login_qr_code_inner(
    state: AppAuthState,
) -> Result<IamLoginQrCodeResponse, AppSessionCreateError> {
    ensure_qr_login_enabled(&state).await?;
    let qr_key = state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    let expire_time = current_unix_seconds()
        .checked_add(LOGIN_QR_CODE_TTL_SECONDS)
        .ok_or_else(|| {
            AppSessionCreateError::System("QR login expiration overflowed".to_owned())
        })?;

    Ok(IamLoginQrCodeResponse {
        qr_content: format!("sdkwork://auth/qr-login?appId={APP_ID}&qrKey={qr_key}"),
        qr_key,
        title: "Desktop QR Login".to_owned(),
        description: "Scan with SDKWork mobile app to continue".to_owned(),
        r#type: "app".to_owned(),
        expire_time,
    })
}

async fn retrieve_login_qr_code(Path(qr_key): Path<String>) -> Response {
    match retrieve_login_qr_code_inner(qr_key).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(error) => auth_error_response(error),
    }
}

async fn retrieve_login_qr_code_inner(
    qr_key: String,
) -> Result<IamLoginQrCodeStatusResponse, AppSessionCreateError> {
    let _qr_key = normalize_required_field("qrKey", &qr_key, 128)?;
    Ok(IamLoginQrCodeStatusResponse {
        status: "pending".to_owned(),
    })
}

async fn auth_settings_for_scope(
    state: &AppAuthState,
    tenant_code: &str,
    organization_code: &str,
) -> Result<AdminAuthSettings, AppSessionCreateError> {
    let Some(store) = state.auth_settings_store.as_ref() else {
        return Ok(AdminAuthSettings::default());
    };
    store
        .get_auth_settings_for_scope(GetAdminAuthSettingsScopeQuery {
            tenant_code: optional_string(tenant_code.to_owned()),
            organization_code: optional_string(organization_code.to_owned()),
        })
        .await
        .map_err(|error| {
            if error.is_not_found() {
                AppSessionCreateError::BadRequest(error.to_string())
            } else {
                AppSessionCreateError::System(error.to_string())
            }
        })
}

async fn default_auth_settings(
    state: &AppAuthState,
) -> Result<AdminAuthSettings, AppSessionCreateError> {
    auth_settings_for_scope(state, "", "").await
}

async fn ensure_login_method_enabled(
    state: &AppAuthState,
    tenant_code: &str,
    organization_code: &str,
    grant_type: &str,
) -> Result<(), AppSessionCreateError> {
    let settings = auth_settings_for_scope(state, tenant_code, organization_code).await?;
    let method = login_method_from_grant_type(grant_type)?;
    if !settings.login_methods.iter().any(|item| item == method) {
        return Err(AppSessionCreateError::BadRequest(format!(
            "{} is not enabled",
            login_method_label(method)
        )));
    }
    if method == "emailCode" && !settings.verification_policy.email_code_login_enabled {
        return Err(AppSessionCreateError::BadRequest(
            "email code login is not enabled".to_owned(),
        ));
    }
    if method == "phoneCode" && !settings.verification_policy.phone_code_login_enabled {
        return Err(AppSessionCreateError::BadRequest(
            "phone code login is not enabled".to_owned(),
        ));
    }
    Ok(())
}

fn login_method_from_grant_type(grant_type: &str) -> Result<&'static str, AppSessionCreateError> {
    match grant_type {
        "password" => Ok("password"),
        "email_code" => Ok("emailCode"),
        "phone_code" => Ok("phoneCode"),
        "session_bridge" => Ok("sessionBridge"),
        _ => Err(AppSessionCreateError::BadRequest(format!(
            "grantType {grant_type} is not supported by this endpoint"
        ))),
    }
}

fn login_method_label(method: &str) -> &'static str {
    match method {
        "emailCode" => "email code login",
        "phoneCode" => "phone code login",
        "sessionBridge" => "session bridge login",
        _ => "password login",
    }
}

async fn ensure_registration_method_enabled(
    state: &AppAuthState,
    tenant_code: &str,
    organization_code: &str,
    channel: &str,
) -> Result<(), AppSessionCreateError> {
    let settings = auth_settings_for_scope(state, tenant_code, organization_code).await?;
    let method = register_method_from_channel(channel);
    if settings.register_methods.iter().any(|item| item == method) {
        return Ok(());
    }
    Err(AppSessionCreateError::BadRequest(format!(
        "{} registration is not enabled",
        method_label(method)
    )))
}

async fn ensure_recovery_method_enabled(
    state: &AppAuthState,
    channel: &str,
) -> Result<(), AppSessionCreateError> {
    let settings = default_auth_settings(state).await?;
    let method = recovery_method_from_channel(channel);
    if settings.recovery_methods.iter().any(|item| item == method) {
        return Ok(());
    }
    Err(AppSessionCreateError::BadRequest(format!(
        "{} password recovery is not enabled",
        method_label(method)
    )))
}

async fn ensure_verification_code_allowed(
    state: &AppAuthState,
    scene: &str,
    verify_type: &str,
) -> Result<(), AppSessionCreateError> {
    let settings = default_auth_settings(state).await?;
    match scene {
        "LOGIN" => {
            let method = if verify_type == "PHONE" {
                "phoneCode"
            } else {
                "emailCode"
            };
            if !settings.login_methods.iter().any(|item| item == method) {
                return Err(AppSessionCreateError::BadRequest(format!(
                    "{} is not enabled",
                    login_method_label(method)
                )));
            }
            if method == "emailCode" && !settings.verification_policy.email_code_login_enabled {
                return Err(AppSessionCreateError::BadRequest(
                    "email code login is not enabled".to_owned(),
                ));
            }
            if method == "phoneCode" && !settings.verification_policy.phone_code_login_enabled {
                return Err(AppSessionCreateError::BadRequest(
                    "phone code login is not enabled".to_owned(),
                ));
            }
            Ok(())
        }
        "REGISTER" => {
            let method = register_method_from_verify_type(verify_type);
            if settings.register_methods.iter().any(|item| item == method) {
                return Ok(());
            }
            Err(AppSessionCreateError::BadRequest(format!(
                "{} registration is not enabled",
                method_label(method)
            )))
        }
        "RESET_PASSWORD" => {
            let method = recovery_method_from_verify_type(verify_type);
            if settings.recovery_methods.iter().any(|item| item == method) {
                return Ok(());
            }
            Err(AppSessionCreateError::BadRequest(format!(
                "{} password recovery is not enabled",
                method_label(method)
            )))
        }
        _ => Err(AppSessionCreateError::BadRequest(
            "scene must be LOGIN, REGISTER, or RESET_PASSWORD".to_owned(),
        )),
    }
}

async fn ensure_qr_login_enabled(state: &AppAuthState) -> Result<(), AppSessionCreateError> {
    let settings = default_auth_settings(state).await?;
    if settings.qr_login_enabled {
        Ok(())
    } else {
        Err(AppSessionCreateError::BadRequest(
            "QR login is not enabled".to_owned(),
        ))
    }
}

async fn ensure_oauth_login_enabled(state: &AppAuthState) -> Result<(), AppSessionCreateError> {
    let settings = default_auth_settings(state).await?;
    if settings.oauth_login_enabled {
        Ok(())
    } else {
        Err(AppSessionCreateError::BadRequest(
            "OAuth login is not enabled".to_owned(),
        ))
    }
}

fn register_method_from_channel(channel: &str) -> &'static str {
    if channel == "PHONE" {
        "phone"
    } else {
        "email"
    }
}

fn register_method_from_verify_type(verify_type: &str) -> &'static str {
    if verify_type == "PHONE" {
        "phone"
    } else {
        "email"
    }
}

fn recovery_method_from_channel(channel: &str) -> &'static str {
    if channel == "SMS" {
        "phone"
    } else {
        "email"
    }
}

fn recovery_method_from_verify_type(verify_type: &str) -> &'static str {
    if verify_type == "PHONE" {
        "phone"
    } else {
        "email"
    }
}

fn method_label(method: &str) -> &'static str {
    if method == "phone" {
        "phone"
    } else {
        "email"
    }
}

fn auth_error_response(error: AppSessionCreateError) -> Response {
    match error {
        AppSessionCreateError::Unauthorized => (
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error("4010", INVALID_CREDENTIALS_MESSAGE)),
        )
            .into_response(),
        AppSessionCreateError::TrustedSubjectRequired => (
            StatusCode::UNAUTHORIZED,
            Json(PlusApiResult::error(
                "4010",
                "trusted request subject is required",
            )),
        )
            .into_response(),
        AppSessionCreateError::BadRequest(message) => (
            StatusCode::BAD_REQUEST,
            Json(PlusApiResult::error("4001", message)),
        )
            .into_response(),
        AppSessionCreateError::System(message) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(PlusApiResult::error("5000", message)),
        )
            .into_response(),
    }
}

async fn create_session_inner(
    state: AppAuthState,
    headers: HeaderMap,
    request: IamSessionCreateRequest,
) -> Result<IamSessionResponse, AppSessionCreateError> {
    let grant_type = request
        .grant_type
        .as_deref()
        .map(normalize_grant_type)
        .unwrap_or_else(|| "password".to_owned());
    let tenant_code = normalize_optional_field(
        "tenantCode",
        request.tenant_code.as_deref(),
        MAX_TENANT_CODE_LENGTH,
    )?;
    let organization_code = normalize_optional_field(
        "organizationCode",
        request.organization_code.as_deref(),
        MAX_ORGANIZATION_CODE_LENGTH,
    )?;
    ensure_login_method_enabled(&state, &tenant_code, &organization_code, &grant_type).await?;
    if grant_type == "session_bridge" {
        let request_id = normalize_request_id(&headers)?;
        return crate::api::app_session::create_session_bridge_response(
            &state.app_session_config,
            state.event_store.as_ref(),
            state.entity_uuid_generator.as_ref(),
            &headers,
            request_id,
        )
        .await;
    }
    if grant_type == "email_code" || grant_type == "phone_code" {
        return create_code_login_session(state, headers, request, &grant_type).await;
    }
    if grant_type != "password" {
        return Err(AppSessionCreateError::BadRequest(format!(
            "grantType {grant_type} is not supported by this endpoint"
        )));
    }

    let account = normalize_required_field(
        "username",
        request.username.as_deref().unwrap_or_default(),
        MAX_ACCOUNT_LENGTH,
    )?;
    let password = normalize_required_field(
        "password",
        request.password.as_deref().unwrap_or_default(),
        MAX_PASSWORD_LENGTH,
    )?;
    let request_id = normalize_request_id(&headers)?;
    let Some(user) = state
        .auth_store
        .find_user_for_password_login(&account)
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?
    else {
        return Err(AppSessionCreateError::Unauthorized);
    };

    if user.status != "active" {
        return Err(AppSessionCreateError::Unauthorized);
    }

    let verified = state
        .password_hasher
        .verify_password(&password, &user.password_hash)
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    if !verified {
        return Err(AppSessionCreateError::Unauthorized);
    }

    issue_iam_session(
        &state.app_session_config,
        state.event_store.as_ref(),
        state.entity_uuid_generator.as_ref(),
        user.into(),
        "password",
        request_id,
    )
    .await
}

async fn create_code_login_session(
    state: AppAuthState,
    headers: HeaderMap,
    request: IamSessionCreateRequest,
    grant_type: &str,
) -> Result<IamSessionResponse, AppSessionCreateError> {
    let verify_type = if grant_type == "phone_code" {
        "PHONE"
    } else {
        "EMAIL"
    };
    let target = if verify_type == "PHONE" {
        normalize_required_field(
            "phone",
            request.phone.as_deref().unwrap_or_default(),
            MAX_PHONE_LENGTH,
        )?
    } else {
        normalize_required_field(
            "email",
            request.email.as_deref().unwrap_or_default(),
            MAX_EMAIL_LENGTH,
        )?
    };
    let code = normalize_required_field(
        "code",
        request.code.as_deref().unwrap_or_default(),
        MAX_CODE_LENGTH,
    )?;
    let request_id = normalize_request_id(&headers)?;
    let code_hash = sha256_hex(&code);
    let valid = state
        .auth_store
        .consume_verification_code(AppAuthVerificationCodeLookup {
            code_id: None,
            target: target.clone(),
            scene: "LOGIN".to_owned(),
            verify_type: verify_type.to_owned(),
            code_hash,
            now: current_unix_seconds(),
        })
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    if !valid {
        return Err(AppSessionCreateError::Unauthorized);
    }

    let Some(user) = state
        .auth_store
        .find_user_for_code_login(&target, verify_type)
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?
    else {
        return Err(AppSessionCreateError::Unauthorized);
    };
    if user.status != "active" {
        return Err(AppSessionCreateError::Unauthorized);
    }

    issue_iam_session(
        &state.app_session_config,
        state.event_store.as_ref(),
        state.entity_uuid_generator.as_ref(),
        user.into(),
        grant_type,
        request_id,
    )
    .await
}

async fn create_registration(
    State(state): State<AppAuthState>,
    headers: HeaderMap,
    Json(request): Json<IamRegistrationCreateRequest>,
) -> Response {
    match create_registration_inner(state, headers, request).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(error) => auth_error_response(error),
    }
}

async fn create_registration_inner(
    state: AppAuthState,
    headers: HeaderMap,
    request: IamRegistrationCreateRequest,
) -> Result<IamSessionResponse, AppSessionCreateError> {
    let username = normalize_required_field("username", &request.username, MAX_ACCOUNT_LENGTH)?;
    let password = normalize_required_field("password", &request.password, MAX_PASSWORD_LENGTH)?;
    if let Some(confirm_password) = request.confirm_password.as_deref() {
        if !confirm_password.is_empty() && confirm_password != password {
            return Err(AppSessionCreateError::BadRequest(
                "confirmPassword must match password".to_owned(),
            ));
        }
    }
    let email = normalize_optional_field("email", request.email.as_deref(), MAX_EMAIL_LENGTH)?;
    let phone = normalize_optional_field("phone", request.phone.as_deref(), MAX_PHONE_LENGTH)?;
    if email.is_empty() && phone.is_empty() {
        return Err(AppSessionCreateError::BadRequest(
            "email or phone must be provided".to_owned(),
        ));
    }
    let channel = normalize_auth_channel(request.channel.as_deref(), &email, &phone)?;
    let tenant_code = normalize_optional_field(
        "tenantCode",
        request.tenant_code.as_deref(),
        MAX_TENANT_CODE_LENGTH,
    )?;
    let organization_code = normalize_optional_field(
        "organizationCode",
        request.organization_code.as_deref(),
        MAX_ORGANIZATION_CODE_LENGTH,
    )?;
    let verification_code = normalize_optional_field(
        "verificationCode",
        request.verification_code.as_deref(),
        MAX_CODE_LENGTH,
    )?;
    ensure_registration_method_enabled(&state, &tenant_code, &organization_code, &channel).await?;
    let registration_verification_required =
        registration_verification_required(&state, &tenant_code, &organization_code, &channel)
            .await?;
    if registration_verification_required && verification_code.is_empty() {
        return Err(AppSessionCreateError::BadRequest(
            "verificationCode must not be empty".to_owned(),
        ));
    }
    let request_id = normalize_request_id(&headers)?;
    let now = current_unix_seconds();
    let password_hash = state
        .password_hasher
        .hash_password(&password, &format!("registration:{username}:{now}"))
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    let user = state
        .auth_store
        .create_registration(AppAuthRegistrationCommand {
            tenant_code: optional_string(tenant_code),
            organization_code: optional_string(organization_code),
            username: username.clone(),
            display_name: username,
            email,
            phone,
            channel,
            password_hash,
            verification_code_hash: optional_string(verification_code)
                .map(|code| sha256_hex(&code)),
            now,
        })
        .await
        .map_err(|error| {
            if error.is_conflict() {
                AppSessionCreateError::BadRequest(error.to_string())
            } else {
                AppSessionCreateError::System(error.to_string())
            }
        })?;

    issue_iam_session(
        &state.app_session_config,
        state.event_store.as_ref(),
        state.entity_uuid_generator.as_ref(),
        user.into(),
        "password",
        request_id,
    )
    .await
}

async fn registration_verification_required(
    state: &AppAuthState,
    tenant_code: &str,
    organization_code: &str,
    channel: &str,
) -> Result<bool, AppSessionCreateError> {
    let settings = auth_settings_for_scope(state, tenant_code, organization_code).await?;
    Ok(match channel {
        "PHONE" => {
            settings
                .verification_policy
                .phone_registration_verification_required
        }
        _ => {
            settings
                .verification_policy
                .email_registration_verification_required
        }
    })
}

async fn create_verification_code(
    State(state): State<AppAuthState>,
    Json(request): Json<IamVerificationCodeCreateRequest>,
) -> Response {
    match create_verification_code_inner(state, request).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(error) => auth_error_response(error),
    }
}

async fn create_verification_code_inner(
    state: AppAuthState,
    request: IamVerificationCodeCreateRequest,
) -> Result<IamVerificationCodeResponse, AppSessionCreateError> {
    let target = normalize_required_field("target", &request.target, MAX_CODE_TARGET_LENGTH)?;
    let scene = normalize_scene(&request.scene)?;
    let verify_type = normalize_verify_type(&request.verify_type)?;
    ensure_verification_code_allowed(&state, &scene, &verify_type).await?;
    let now = current_unix_seconds();
    let expires_at = now
        .checked_add(VERIFICATION_CODE_TTL_SECONDS)
        .ok_or_else(|| {
            AppSessionCreateError::System("verification code expiration overflowed".to_owned())
        })?;
    let credential_id = state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    let code = verification_code_for_mode(state.expose_debug_code, &credential_id);
    let code_id = state
        .auth_store
        .create_verification_code(AppAuthVerificationCodeCommand {
            credential_id,
            target: target.clone(),
            scene: scene.clone(),
            verify_type: verify_type.clone(),
            code_hash: sha256_hex(&code),
            expires_at,
            now,
        })
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    let expires_at_api = unix_seconds_to_api_time(expires_at);
    state
        .verification_code_sender
        .send_verification_code(VerificationCodeDeliveryRequest {
            code_id: code_id.clone(),
            target,
            scene,
            channel: delivery_channel_from_verify_type(&verify_type),
            code: code.clone(),
            expires_at: expires_at_api.clone(),
        })
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    Ok(IamVerificationCodeResponse {
        code_id,
        expires_at: expires_at_api,
        debug_code: state.expose_debug_code.then_some(code),
    })
}

async fn verify_code(
    State(state): State<AppAuthState>,
    Json(request): Json<IamVerificationCodeVerifyRequest>,
) -> Response {
    match verify_code_inner(state, request).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(error) => auth_error_response(error),
    }
}

async fn verify_code_inner(
    state: AppAuthState,
    request: IamVerificationCodeVerifyRequest,
) -> Result<IamVerificationCodeVerifyResponse, AppSessionCreateError> {
    let target = normalize_required_field("target", &request.target, MAX_CODE_TARGET_LENGTH)?;
    let scene = normalize_scene(&request.scene)?;
    let verify_type = normalize_verify_type(&request.verify_type)?;
    let code = normalize_required_field("code", &request.code, MAX_CODE_LENGTH)?;
    let code_id = normalize_optional_field("codeId", request.code_id.as_deref(), 128)?;
    let valid = state
        .auth_store
        .verify_code(AppAuthVerificationCodeLookup {
            code_id: optional_string(code_id),
            target,
            scene,
            verify_type,
            code_hash: sha256_hex(&code),
            now: current_unix_seconds(),
        })
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    Ok(IamVerificationCodeVerifyResponse {
        verified: valid,
        valid,
    })
}

async fn create_password_reset_request(
    State(state): State<AppAuthState>,
    Json(request): Json<IamPasswordResetRequestCreateRequest>,
) -> Response {
    match create_password_reset_request_inner(state, request).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(error) => auth_error_response(error),
    }
}

async fn create_password_reset_request_inner(
    state: AppAuthState,
    request: IamPasswordResetRequestCreateRequest,
) -> Result<IamPasswordResetRequestResponse, AppSessionCreateError> {
    let account = normalize_required_field("account", &request.account, MAX_CODE_TARGET_LENGTH)?;
    let channel = normalize_reset_channel(&request.channel)?;
    ensure_recovery_method_enabled(&state, &channel).await?;
    let now = current_unix_seconds();
    let expires_at = now
        .checked_add(PASSWORD_RESET_CODE_TTL_SECONDS)
        .ok_or_else(|| {
            AppSessionCreateError::System("password reset expiration overflowed".to_owned())
        })?;
    let credential_id = state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    let code = verification_code_for_mode(state.expose_debug_code, &credential_id);
    let request_id = state
        .auth_store
        .create_password_reset_code(AppAuthPasswordResetCodeCommand {
            credential_id,
            account: account.clone(),
            channel: channel.clone(),
            code_hash: sha256_hex(&code),
            expires_at,
            now,
        })
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    let expires_at_api = unix_seconds_to_api_time(expires_at);
    state
        .verification_code_sender
        .send_verification_code(VerificationCodeDeliveryRequest {
            code_id: request_id.clone(),
            target: account,
            scene: "RESET_PASSWORD".to_owned(),
            channel,
            code: code.clone(),
            expires_at: expires_at_api.clone(),
        })
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    Ok(IamPasswordResetRequestResponse {
        request_id,
        expires_at: expires_at_api,
        debug_code: state.expose_debug_code.then_some(code),
    })
}

async fn create_password_reset(
    State(state): State<AppAuthState>,
    Json(request): Json<IamPasswordResetCreateRequest>,
) -> Response {
    match create_password_reset_inner(state, request).await {
        Ok(response) => Json(PlusApiResult::success(response)).into_response(),
        Err(error) => auth_error_response(error),
    }
}

async fn create_password_reset_inner(
    state: AppAuthState,
    request: IamPasswordResetCreateRequest,
) -> Result<NoData, AppSessionCreateError> {
    let account = normalize_required_field("account", &request.account, MAX_CODE_TARGET_LENGTH)?;
    let code = normalize_required_field("code", &request.code, MAX_CODE_LENGTH)?;
    let new_password =
        normalize_required_field("newPassword", &request.new_password, MAX_PASSWORD_LENGTH)?;
    if let Some(confirm_password) = request.confirm_password.as_deref() {
        if !confirm_password.is_empty() && confirm_password != new_password {
            return Err(AppSessionCreateError::BadRequest(
                "confirmPassword must match newPassword".to_owned(),
            ));
        }
    }
    let now = current_unix_seconds();
    let password_hash = state
        .password_hasher
        .hash_password(&new_password, &format!("password-reset:{account}:{now}"))
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    let reset = state
        .auth_store
        .reset_password(AppAuthPasswordResetCommand {
            account,
            code_hash: sha256_hex(&code),
            password_hash,
            now,
        })
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    if !reset {
        return Err(AppSessionCreateError::BadRequest(
            INVALID_CODE_MESSAGE.to_owned(),
        ));
    }
    Ok(NoData {})
}

async fn oauth_authorization_url_not_configured(
    State(state): State<AppAuthState>,
    Query(query): Query<IamOauthAuthorizationUrlQuery>,
) -> Response {
    let _provider = query.provider;
    let _redirect_uri_len = query.redirect_uri.len();
    let _state_len = query.state.as_deref().unwrap_or_default().len();
    let _scope_len = query.scope.as_deref().unwrap_or_default().len();
    match ensure_oauth_login_enabled(&state).await {
        Ok(()) => oauth_not_configured_response(),
        Err(error) => auth_error_response(error),
    }
}

async fn create_oauth_session(
    State(state): State<AppAuthState>,
    Json(request): Json<IamOauthSessionCreateRequest>,
) -> Response {
    let _provider = request.provider;
    let _code_len = request.code.len();
    match ensure_oauth_login_enabled(&state).await {
        Ok(()) => oauth_not_configured_response(),
        Err(error) => auth_error_response(error),
    }
}

async fn retrieve_runtime_settings(
    State(state): State<AppAuthState>,
    Query(query): Query<IamRuntimeSettingsQuery>,
) -> Response {
    match retrieve_runtime_settings_inner(state, query).await {
        Ok(settings) => {
            Json(PlusApiResult::success(to_auth_settings_response(settings))).into_response()
        }
        Err(error) => auth_error_response(error),
    }
}

async fn retrieve_runtime_settings_inner(
    state: AppAuthState,
    query: IamRuntimeSettingsQuery,
) -> Result<crate::ports::AdminAuthSettings, AppSessionCreateError> {
    let Some(store) = state.auth_settings_store.as_ref() else {
        return Ok(crate::ports::AdminAuthSettings::default());
    };
    let tenant_code = normalize_optional_field(
        "tenant_code",
        query.tenant_code.as_deref(),
        MAX_TENANT_CODE_LENGTH,
    )?;
    let organization_code = normalize_optional_field(
        "organization_code",
        query.organization_code.as_deref(),
        MAX_ORGANIZATION_CODE_LENGTH,
    )?;
    store
        .get_auth_settings_for_scope(GetAdminAuthSettingsScopeQuery {
            tenant_code: optional_string(tenant_code),
            organization_code: optional_string(organization_code),
        })
        .await
        .map_err(|error| {
            if error.is_not_found() {
                AppSessionCreateError::BadRequest(error.to_string())
            } else {
                AppSessionCreateError::System(error.to_string())
            }
        })
}

fn oauth_not_configured_response() -> Response {
    (
        StatusCode::SERVICE_UNAVAILABLE,
        Json(PlusApiResult::error(
            "5030",
            "OAuth provider is not configured",
        )),
    )
        .into_response()
}

struct UnconfiguredAppAuthStore;

impl AppAuthStore for UnconfiguredAppAuthStore {
    fn find_user_for_password_login<'a>(
        &'a self,
        _account: &'a str,
    ) -> crate::ports::AppAuthFuture<'a, Option<AppAuthUserCredential>> {
        Box::pin(async { Ok(None) })
    }

    fn find_user_for_code_login<'a>(
        &'a self,
        _target: &'a str,
        _verify_type: &'a str,
    ) -> crate::ports::AppAuthFuture<'a, Option<AppAuthUserCredential>> {
        Box::pin(async { Ok(None) })
    }

    fn create_verification_code<'a>(
        &'a self,
        _command: AppAuthVerificationCodeCommand,
    ) -> crate::ports::AppAuthFuture<'a, String> {
        Box::pin(async {
            Err(crate::domain::DomainError::new(
                "app auth store is not configured",
            ))
        })
    }

    fn verify_code<'a>(
        &'a self,
        _lookup: AppAuthVerificationCodeLookup,
    ) -> crate::ports::AppAuthFuture<'a, bool> {
        Box::pin(async { Ok(false) })
    }

    fn consume_verification_code<'a>(
        &'a self,
        _lookup: AppAuthVerificationCodeLookup,
    ) -> crate::ports::AppAuthFuture<'a, bool> {
        Box::pin(async { Ok(false) })
    }

    fn create_registration<'a>(
        &'a self,
        _command: AppAuthRegistrationCommand,
    ) -> crate::ports::AppAuthFuture<'a, AppAuthUserCredential> {
        Box::pin(async {
            Err(crate::domain::DomainError::new(
                "app auth store is not configured",
            ))
        })
    }

    fn create_password_reset_code<'a>(
        &'a self,
        _command: AppAuthPasswordResetCodeCommand,
    ) -> crate::ports::AppAuthFuture<'a, String> {
        Box::pin(async {
            Err(crate::domain::DomainError::new(
                "app auth store is not configured",
            ))
        })
    }

    fn reset_password<'a>(
        &'a self,
        _command: AppAuthPasswordResetCommand,
    ) -> crate::ports::AppAuthFuture<'a, bool> {
        Box::pin(async { Ok(false) })
    }
}

pub(crate) async fn issue_iam_session(
    app_session_config: &AppSessionConfig,
    event_store: &(dyn AppSessionEventStore + Send + Sync),
    entity_uuid_generator: &(dyn EntityUuidGenerator + Send + Sync),
    user: IamSessionIssueUser,
    auth_level: &str,
    request_id: Option<String>,
) -> Result<IamSessionResponse, AppSessionCreateError> {
    let issued_at = current_unix_seconds();
    let expires_at_unix = expires_at(app_session_config, issued_at)?;
    let subject = TrustedRequestSubject {
        tenant_id: user.tenant_id,
        organization_id: user.organization_id,
        user_id: user.id,
        operator_id: user.id,
        operator_type: 1,
    };
    let auth_token =
        sign_app_session_token(app_session_config, subject, issued_at, expires_at_unix);
    let access_token = sign_app_session_token(
        app_session_config,
        subject,
        issued_at + 1,
        expires_at_unix + 1,
    );
    let refresh_token = sign_app_session_token(
        app_session_config,
        subject,
        issued_at + 2,
        expires_at_unix + 2,
    );
    let session_id = entity_uuid_generator
        .generate_entity_uuid()
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    let security_event_id = entity_uuid_generator
        .generate_entity_uuid()
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    let audit_event_id = entity_uuid_generator
        .generate_entity_uuid()
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;
    let expires_at = expires_at_unix.to_string();
    let created_at = issued_at.to_string();
    let data_scope = vec![
        format!("tenant:{}", user.tenant_id),
        format!("organization:{}", user.organization_id),
        format!("user:{}", user.id),
    ];
    let permission_scope = vec!["clawrouter:console".to_owned()];
    let context = IamAppContext {
        app_id: APP_ID.to_owned(),
        auth_level: auth_level.to_owned(),
        data_scope: data_scope.clone(),
        deployment_mode: DEPLOYMENT_MODE.to_owned(),
        environment: ENVIRONMENT.to_owned(),
        organization_id: user.organization_id.to_string(),
        permission_scope: permission_scope.clone(),
        session_id: session_id.clone(),
        tenant_id: user.tenant_id.to_string(),
        user_id: user.id.to_string(),
    };

    event_store
        .record_app_session_issued(RecordAppSessionIssuedEventCommand {
            session_id: session_id.clone(),
            security_event_id,
            audit_event_id,
            tenant_id: user.tenant_id,
            organization_id: user.organization_id,
            user_id: user.id,
            request_id,
            auth_level: auth_level.to_owned(),
            app_id: APP_ID.to_owned(),
            environment: ENVIRONMENT.to_owned(),
            deployment_mode: DEPLOYMENT_MODE.to_owned(),
            auth_token_hash: sha256_hex(&auth_token),
            access_token_hash: sha256_hex(&access_token),
            refresh_token_hash: Some(sha256_hex(&refresh_token)),
            session_id_hash: sha256_hex(&session_id),
            sharding_key: user.tenant_id.to_string(),
            sharding_strategy: "tenant".to_owned(),
            data_scope_json: serde_json::to_string(&data_scope).unwrap_or_else(|_| "[]".to_owned()),
            permission_scope_json: serde_json::to_string(&permission_scope)
                .unwrap_or_else(|_| "[]".to_owned()),
            expires_at: expires_at.clone(),
            created_at: created_at.clone(),
        })
        .await
        .map_err(|error| AppSessionCreateError::System(error.to_string()))?;

    Ok(IamSessionResponse {
        access_token,
        auth_token,
        refresh_token,
        session_id: session_id.clone(),
        expires_at,
        context,
        user: IamUserResponse {
            id: user.id.to_string(),
            username: user.username,
            display_name: user.display_name,
            email: user.email,
            avatar_url: user.avatar_url,
            phone: user.phone,
            language: normalize_language(user.language),
            is_verified: user.is_verified,
            status: user.status,
            registered_at: user.registered_at,
            last_login: user.last_login,
            last_login_ip: user.last_login_ip,
            password_last_changed: user.password_last_changed,
            two_factor_enabled: user.two_factor_enabled,
            third_party_bound: user.third_party_bound,
        },
    })
}

fn to_auth_settings_response(
    settings: crate::ports::AdminAuthSettings,
) -> IamRuntimeAuthSettingsResponse {
    IamRuntimeAuthSettingsResponse {
        left_rail_mode: settings.left_rail_mode,
        login_methods: settings.login_methods,
        oauth_login_enabled: settings.oauth_login_enabled,
        oauth_providers: settings.oauth_providers,
        oauth_region: settings.oauth_region,
        qr_login_enabled: settings.qr_login_enabled,
        recovery_methods: settings.recovery_methods,
        register_methods: settings.register_methods,
        verification_policy: IamRuntimeAuthVerificationPolicyResponse {
            email_code_login_enabled: settings.verification_policy.email_code_login_enabled,
            email_registration_verification_required: settings
                .verification_policy
                .email_registration_verification_required,
            phone_code_login_enabled: settings.verification_policy.phone_code_login_enabled,
            phone_registration_verification_required: settings
                .verification_policy
                .phone_registration_verification_required,
        },
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) enum AppSessionCreateError {
    Unauthorized,
    TrustedSubjectRequired,
    BadRequest(String),
    System(String),
}

fn normalize_grant_type(value: &str) -> String {
    value.trim().replace('-', "_").to_ascii_lowercase()
}

fn normalize_required_field(
    name: &str,
    value: &str,
    max_len: usize,
) -> Result<String, AppSessionCreateError> {
    let normalized = value.trim();
    if normalized.is_empty() {
        return Err(AppSessionCreateError::BadRequest(format!(
            "{name} must not be empty"
        )));
    }
    if normalized.len() > max_len {
        return Err(AppSessionCreateError::BadRequest(format!(
            "{name} must be at most {max_len} characters"
        )));
    }
    Ok(normalized.to_owned())
}

fn normalize_optional_field(
    name: &str,
    value: Option<&str>,
    max_len: usize,
) -> Result<String, AppSessionCreateError> {
    let Some(value) = value else {
        return Ok(String::new());
    };
    let normalized = value.trim();
    if normalized.len() > max_len {
        return Err(AppSessionCreateError::BadRequest(format!(
            "{name} must be at most {max_len} characters"
        )));
    }
    Ok(normalized.to_owned())
}

fn normalize_scene(value: &str) -> Result<String, AppSessionCreateError> {
    let normalized = value.trim().replace('-', "_").to_ascii_uppercase();
    match normalized.as_str() {
        "LOGIN" | "REGISTER" | "RESET_PASSWORD" => Ok(normalized),
        _ => Err(AppSessionCreateError::BadRequest(
            "scene must be LOGIN, REGISTER, or RESET_PASSWORD".to_owned(),
        )),
    }
}

fn normalize_verify_type(value: &str) -> Result<String, AppSessionCreateError> {
    let normalized = value.trim().replace('-', "_").to_ascii_uppercase();
    match normalized.as_str() {
        "EMAIL" | "PHONE" => Ok(normalized),
        _ => Err(AppSessionCreateError::BadRequest(
            "verifyType must be EMAIL or PHONE".to_owned(),
        )),
    }
}

fn normalize_reset_channel(value: &str) -> Result<String, AppSessionCreateError> {
    let normalized = value.trim().replace('-', "_").to_ascii_uppercase();
    match normalized.as_str() {
        "EMAIL" | "SMS" | "PHONE" => {
            if normalized == "PHONE" {
                Ok("SMS".to_owned())
            } else {
                Ok(normalized)
            }
        }
        _ => Err(AppSessionCreateError::BadRequest(
            "channel must be EMAIL or SMS".to_owned(),
        )),
    }
}

fn delivery_channel_from_verify_type(value: &str) -> String {
    if value == "PHONE" {
        "SMS".to_owned()
    } else {
        value.to_owned()
    }
}

fn normalize_auth_channel(
    value: Option<&str>,
    email: &str,
    phone: &str,
) -> Result<String, AppSessionCreateError> {
    let normalized = value
        .unwrap_or(if !email.is_empty() { "EMAIL" } else { "PHONE" })
        .trim()
        .replace('-', "_")
        .to_ascii_uppercase();
    match normalized.as_str() {
        "EMAIL" if !email.is_empty() => Ok(normalized),
        "PHONE" | "SMS" if !phone.is_empty() => Ok("PHONE".to_owned()),
        "EMAIL" | "PHONE" | "SMS" => Err(AppSessionCreateError::BadRequest(
            "channel target is missing".to_owned(),
        )),
        _ => Err(AppSessionCreateError::BadRequest(
            "channel must be EMAIL or PHONE".to_owned(),
        )),
    }
}

fn optional_string(value: String) -> Option<String> {
    if value.is_empty() {
        None
    } else {
        Some(value)
    }
}

pub(crate) fn normalize_request_id(
    headers: &HeaderMap,
) -> Result<Option<String>, AppSessionCreateError> {
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

pub(crate) fn current_unix_seconds() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}

pub(crate) fn normalize_language(language: String) -> String {
    let normalized = language.trim();
    if normalized.is_empty() {
        "en-US".to_owned()
    } else {
        normalized.to_owned()
    }
}

fn verification_code_for_mode(expose_debug_code: bool, entropy: &str) -> String {
    if expose_debug_code {
        local_debug_code()
    } else {
        verification_code_from_entropy(entropy)
    }
}

fn local_debug_code() -> String {
    LOCAL_DEBUG_VERIFICATION_CODE.to_owned()
}

fn sha256_hex(value: &str) -> String {
    hex::encode(Sha256::digest(value.as_bytes()))
}

fn verification_code_from_entropy(value: &str) -> String {
    let digest = Sha256::digest(value.as_bytes());
    let mut number_bytes = [0_u8; 8];
    number_bytes.copy_from_slice(&digest[..8]);
    let number = u64::from_be_bytes(number_bytes) % 1_000_000;
    format!("{number:06}")
}

fn unix_seconds_to_api_time(value: i64) -> String {
    let days = value.div_euclid(86_400);
    let seconds_of_day = value.rem_euclid(86_400);
    let (year, month, day) = civil_from_days(days);
    let hour = seconds_of_day / 3_600;
    let minute = (seconds_of_day % 3_600) / 60;
    let second = seconds_of_day % 60;
    format!("{year:04}-{month:02}-{day:02}T{hour:02}:{minute:02}:{second:02}Z")
}

fn civil_from_days(days_since_unix_epoch: i64) -> (i64, i64, i64) {
    let z = days_since_unix_epoch + 719_468;
    let era = if z >= 0 { z } else { z - 146_096 } / 146_097;
    let day_of_era = z - era * 146_097;
    let year_of_era =
        (day_of_era - day_of_era / 1_460 + day_of_era / 36_524 - day_of_era / 146_096) / 365;
    let mut year = year_of_era + era * 400;
    let day_of_year = day_of_era - (365 * year_of_era + year_of_era / 4 - year_of_era / 100);
    let month_prime = (5 * day_of_year + 2) / 153;
    let day = day_of_year - (153 * month_prime + 2) / 5 + 1;
    let month = month_prime + if month_prime < 10 { 3 } else { -9 };
    year += if month <= 2 { 1 } else { 0 };
    (year, month, day)
}

#[cfg(test)]
mod tests {
    use super::{unix_seconds_to_api_time, verification_code_for_mode};

    #[test]
    fn auth_api_time_uses_utc_iso8601_format() {
        assert_eq!("1970-01-01T00:00:00Z", unix_seconds_to_api_time(0));
        assert_eq!(
            "2026-05-12T00:00:00Z",
            unix_seconds_to_api_time(1_778_544_000)
        );
    }

    #[test]
    fn local_debug_code_is_fixed_for_local_debug_delivery() {
        let first = verification_code_for_mode(true, "credential-1");
        let second = verification_code_for_mode(true, "credential-2");

        assert_eq!("666666", first);
        assert_eq!("666666", second);
    }

    #[test]
    fn production_verification_code_is_six_digit_and_entropy_derived() {
        let first = verification_code_for_mode(false, "credential-1");
        let second = verification_code_for_mode(false, "credential-2");

        assert_eq!(6, first.len());
        assert!(first.chars().all(|character| character.is_ascii_digit()));
        assert_ne!(first, second);
        assert_ne!("666666", first);
    }
}
