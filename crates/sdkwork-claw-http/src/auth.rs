use std::fmt;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::extract::State;
use axum::http::{HeaderMap, HeaderValue, Request, StatusCode, Uri};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use axum::Json;
use hmac::{Hmac, Mac};
use sdkwork_claw_config::{AppSessionConfig, TrustedSubjectConfig};
use sdkwork_claw_security::redact_secret;
use serde::Serialize;
use sha2::Sha256;

const AUTHORIZATION: &str = "authorization";
const SDKWORK_ACCESS_TOKEN: &str = "sdkwork-access-token";
const X_API_KEY: &str = "x-api-key";
const X_GOOG_API_KEY: &str = "x-goog-api-key";
const X_SDKWORK_API_KEY_ID: &str = "x-sdkwork-api-key-id";
const X_SDKWORK_TENANT_ID: &str = "x-sdkwork-tenant-id";
const X_SDKWORK_ORGANIZATION_ID: &str = "x-sdkwork-organization-id";
const X_SDKWORK_USER_ID: &str = "x-sdkwork-user-id";
const X_SDKWORK_SUBJECT_TENANT_ID: &str = "x-sdkwork-subject-tenant-id";
const X_SDKWORK_SUBJECT_ORGANIZATION_ID: &str = "x-sdkwork-subject-organization-id";
const X_SDKWORK_SUBJECT_USER_ID: &str = "x-sdkwork-subject-user-id";
const X_SDKWORK_SUBJECT_TIMESTAMP: &str = "x-sdkwork-subject-timestamp";
const X_SDKWORK_SUBJECT_SIGNATURE: &str = "x-sdkwork-subject-signature";
const DEFAULT_USER_OPERATOR_TYPE: i32 = 1;
const APP_SESSION_TOKEN_VERSION: &str = "v1";
type HmacSha256 = Hmac<Sha256>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ApiKeyCredentialSource {
    AuthorizationBearer,
    ApiKeyHeader,
    GoogleApiKeyHeader,
    QueryKey,
}

#[derive(Clone, PartialEq, Eq)]
pub struct ApiKeyCredential {
    secret: String,
    source: ApiKeyCredentialSource,
}

#[derive(Clone, PartialEq, Eq)]
pub struct ApiKeyIdentity {
    api_key_id: Option<i64>,
    credential: Option<ApiKeyCredential>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ApiKeyIdentityError {
    InvalidApiKeyId,
    InvalidHeaderValue(&'static str),
    InvalidAuthorizationScheme,
    EmptyCredential(ApiKeyCredentialSource),
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TrustedRequestSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
    pub operator_id: i64,
    pub operator_type: i32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum TrustedRequestSubjectError {
    MissingHeader(&'static str),
    InvalidHeaderValue(&'static str),
    InvalidPositiveInteger(&'static str),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum TrustedSubjectBoundaryError {
    MissingHeader(&'static str),
    InvalidHeaderValue(&'static str),
    InvalidPositiveInteger(&'static str),
    InvalidTimestamp,
    TimestampOutsideClockSkew,
    InvalidSignature,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum AppSessionTokenError {
    MissingBearerToken,
    MissingAccessToken,
    InvalidAuthorizationScheme,
    InvalidHeaderValue(&'static str),
    InvalidTokenFormat,
    InvalidPositiveInteger(&'static str),
    InvalidTimestamp(&'static str),
    IssuedAtOutsideClockSkew,
    Expired,
    InvalidSignature,
    SubjectMismatch,
}

#[derive(Clone)]
pub struct AppSubjectBoundaryConfig {
    trusted_subject: TrustedSubjectConfig,
    app_session: AppSessionConfig,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct BoundaryErrorEnvelope {
    code: &'static str,
    msg: String,
    data: Option<()>,
}

impl ApiKeyIdentity {
    pub fn from_headers_and_uri(
        headers: &HeaderMap,
        uri: &Uri,
    ) -> Result<Self, ApiKeyIdentityError> {
        Ok(Self {
            api_key_id: parse_api_key_id(headers)?,
            credential: parse_credential(headers, uri)?,
        })
    }

    pub fn api_key_id(&self) -> Option<i64> {
        self.api_key_id
    }

    pub fn credential_secret(&self) -> Option<&str> {
        self.credential
            .as_ref()
            .map(|credential| credential.secret.as_str())
    }

    pub fn credential_source(&self) -> Option<ApiKeyCredentialSource> {
        self.credential.as_ref().map(|credential| credential.source)
    }
}

impl fmt::Debug for ApiKeyIdentity {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("ApiKeyIdentity")
            .field("api_key_id", &self.api_key_id)
            .field("credential", &self.credential)
            .finish()
    }
}

impl fmt::Debug for ApiKeyCredential {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("ApiKeyCredential")
            .field("secret", &redact_secret(&self.secret))
            .field("source", &self.source)
            .finish()
    }
}

impl fmt::Display for ApiKeyIdentityError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidApiKeyId => write!(formatter, "invalid api key id context"),
            Self::InvalidHeaderValue(name) => write!(formatter, "invalid {name} header value"),
            Self::InvalidAuthorizationScheme => {
                write!(formatter, "authorization header must use Bearer scheme")
            }
            Self::EmptyCredential(_) => write!(formatter, "api key credential must not be empty"),
        }
    }
}

impl std::error::Error for ApiKeyIdentityError {}

impl TrustedRequestSubject {
    pub fn from_headers(headers: &HeaderMap) -> Result<Self, TrustedRequestSubjectError> {
        let tenant_id = required_positive_i64_header(headers, X_SDKWORK_TENANT_ID)?;
        let organization_id = required_positive_i64_header(headers, X_SDKWORK_ORGANIZATION_ID)?;
        let user_id = required_positive_i64_header(headers, X_SDKWORK_USER_ID)?;

        Ok(Self {
            tenant_id,
            organization_id,
            user_id,
            operator_id: user_id,
            operator_type: DEFAULT_USER_OPERATOR_TYPE,
        })
    }
}

impl fmt::Display for TrustedRequestSubjectError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::MissingHeader(name) => write!(formatter, "{name} header is required"),
            Self::InvalidHeaderValue(name) => write!(formatter, "{name} header value is invalid"),
            Self::InvalidPositiveInteger(name) => {
                write!(formatter, "{name} header must be a positive integer")
            }
        }
    }
}

impl std::error::Error for TrustedRequestSubjectError {}

impl AppSubjectBoundaryConfig {
    pub fn new(trusted_subject: TrustedSubjectConfig, app_session: AppSessionConfig) -> Self {
        Self {
            trusted_subject,
            app_session,
        }
    }

    pub fn trusted_subject(&self) -> &TrustedSubjectConfig {
        &self.trusted_subject
    }

    pub fn app_session(&self) -> &AppSessionConfig {
        &self.app_session
    }
}

impl fmt::Debug for AppSubjectBoundaryConfig {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("AppSubjectBoundaryConfig")
            .field("trusted_subject", &self.trusted_subject)
            .field("app_session", &self.app_session)
            .finish()
    }
}

pub async fn app_request_subject_boundary(
    State(config): State<AppSubjectBoundaryConfig>,
    mut request: Request<Body>,
    next: Next,
) -> Response {
    let method = request.method().as_str().to_owned();
    let path_and_query = request
        .uri()
        .path_and_query()
        .map(|value| value.as_str().to_owned())
        .unwrap_or_else(|| request.uri().path().to_owned());
    let now_unix_seconds = match current_unix_seconds() {
        Ok(seconds) => seconds,
        Err(error) => {
            return (
                StatusCode::SERVICE_UNAVAILABLE,
                Json(BoundaryErrorEnvelope {
                    code: "5030",
                    msg: error,
                    data: None,
                }),
            )
                .into_response();
        }
    };
    match inject_verified_app_request_subject(
        request.headers_mut(),
        &method,
        &path_and_query,
        &config,
        now_unix_seconds,
    ) {
        Ok(()) => next.run(request).await,
        Err(message) => unauthorized_boundary_response(message),
    }
}

pub async fn optional_app_request_subject_boundary(
    State(config): State<AppSubjectBoundaryConfig>,
    mut request: Request<Body>,
    next: Next,
) -> Response {
    let method = request.method().as_str().to_owned();
    let path_and_query = request
        .uri()
        .path_and_query()
        .map(|value| value.as_str().to_owned())
        .unwrap_or_else(|| request.uri().path().to_owned());
    if let Ok(now_unix_seconds) = current_unix_seconds() {
        inject_optional_app_request_subject(
            request.headers_mut(),
            &method,
            &path_and_query,
            &config,
            now_unix_seconds,
        );
    } else {
        remove_internal_trusted_subject_headers(request.headers_mut());
        remove_signed_subject_headers(request.headers_mut());
        remove_app_session_token_headers(request.headers_mut());
    }
    next.run(request).await
}

pub fn inject_verified_app_request_subject(
    headers: &mut HeaderMap,
    method: &str,
    path_and_query: &str,
    config: &AppSubjectBoundaryConfig,
    now_unix_seconds: i64,
) -> Result<(), String> {
    inject_verified_trusted_request_subject(
        headers,
        method,
        path_and_query,
        config.trusted_subject(),
        now_unix_seconds,
    )
    .map_err(|error| error.to_string())?;
    if TrustedRequestSubject::from_headers(headers).is_ok() {
        return Ok(());
    }
    if !has_dual_app_session_token_headers(headers) {
        return Ok(());
    }
    let subject =
        match verify_dual_app_session_headers(headers, config.app_session(), now_unix_seconds) {
            Ok(subject) => subject,
            Err(error) => {
                remove_app_session_token_headers(headers);
                return Err(error.to_string());
            }
        };
    remove_app_session_token_headers(headers);
    insert_internal_trusted_subject_headers(headers, subject);
    Ok(())
}

pub fn inject_optional_app_request_subject(
    headers: &mut HeaderMap,
    method: &str,
    path_and_query: &str,
    config: &AppSubjectBoundaryConfig,
    now_unix_seconds: i64,
) {
    match inject_verified_trusted_request_subject(
        headers,
        method,
        path_and_query,
        config.trusted_subject(),
        now_unix_seconds,
    ) {
        Ok(()) if TrustedRequestSubject::from_headers(headers).is_ok() => return,
        Ok(()) => {}
        Err(_) => {
            remove_internal_trusted_subject_headers(headers);
            remove_signed_subject_headers(headers);
        }
    }

    if !has_dual_app_session_token_headers(headers) {
        return;
    };
    match verify_dual_app_session_headers(headers, config.app_session(), now_unix_seconds) {
        Ok(subject) => {
            remove_app_session_token_headers(headers);
            insert_internal_trusted_subject_headers(headers, subject);
        }
        Err(_) => {
            remove_app_session_token_headers(headers);
        }
    }
}

pub async fn trusted_request_subject_boundary(
    State(config): State<TrustedSubjectConfig>,
    mut request: Request<Body>,
    next: Next,
) -> Response {
    let method = request.method().as_str().to_owned();
    let path_and_query = request
        .uri()
        .path_and_query()
        .map(|value| value.as_str().to_owned())
        .unwrap_or_else(|| request.uri().path().to_owned());
    let now_unix_seconds = match current_unix_seconds() {
        Ok(seconds) => seconds,
        Err(error) => {
            return (
                StatusCode::SERVICE_UNAVAILABLE,
                Json(BoundaryErrorEnvelope {
                    code: "5030",
                    msg: error,
                    data: None,
                }),
            )
                .into_response();
        }
    };
    match inject_verified_trusted_request_subject(
        request.headers_mut(),
        &method,
        &path_and_query,
        &config,
        now_unix_seconds,
    ) {
        Ok(()) => next.run(request).await,
        Err(error) => unauthorized_boundary_response(error.to_string()),
    }
}

pub fn inject_verified_trusted_request_subject(
    headers: &mut HeaderMap,
    method: &str,
    path_and_query: &str,
    config: &TrustedSubjectConfig,
    now_unix_seconds: i64,
) -> Result<(), TrustedSubjectBoundaryError> {
    remove_internal_trusted_subject_headers(headers);
    if !has_any_signed_subject_header(headers) {
        return Ok(());
    }

    let tenant_id = required_signed_positive_i64_header(headers, X_SDKWORK_SUBJECT_TENANT_ID)?;
    let organization_id =
        required_signed_positive_i64_header(headers, X_SDKWORK_SUBJECT_ORGANIZATION_ID)?;
    let user_id = required_signed_positive_i64_header(headers, X_SDKWORK_SUBJECT_USER_ID)?;
    let timestamp = required_signed_timestamp(headers)?;
    let signature = required_signed_header(headers, X_SDKWORK_SUBJECT_SIGNATURE)?.to_owned();
    remove_signed_subject_headers(headers);

    validate_timestamp(timestamp, now_unix_seconds, config)?;
    let subject = TrustedRequestSubject {
        tenant_id,
        organization_id,
        user_id,
        operator_id: user_id,
        operator_type: DEFAULT_USER_OPERATOR_TYPE,
    };
    verify_trusted_request_subject_signature(
        config,
        subject,
        timestamp,
        method,
        path_and_query,
        &signature,
    )?;
    insert_internal_trusted_subject_headers(headers, subject);
    Ok(())
}

pub fn sign_trusted_request_subject(
    config: &TrustedSubjectConfig,
    subject: TrustedRequestSubject,
    timestamp: i64,
    method: &str,
    path_and_query: &str,
) -> String {
    let mut mac = hmac_for_config(config);
    mac.update(trusted_subject_payload(subject, timestamp, method, path_and_query).as_bytes());
    hex::encode(mac.finalize().into_bytes())
}

pub fn sign_app_session_token(
    config: &AppSessionConfig,
    subject: TrustedRequestSubject,
    issued_at: i64,
    expires_at: i64,
) -> String {
    let payload = app_session_payload(subject, issued_at, expires_at);
    let mut mac = app_session_hmac_for_config(config);
    mac.update(payload.as_bytes());
    format!(
        "{}.{}.{}",
        APP_SESSION_TOKEN_VERSION,
        payload.replace('\n', "."),
        hex::encode(mac.finalize().into_bytes())
    )
}

pub fn verify_app_session_authorization_header(
    config: &AppSessionConfig,
    authorization: &str,
    now_unix_seconds: i64,
) -> Result<TrustedRequestSubject, AppSessionTokenError> {
    let token = parse_app_session_authorization_bearer(authorization)?;
    verify_app_session_token(config, token, now_unix_seconds)
}

pub fn verify_dual_app_session_headers(
    headers: &HeaderMap,
    config: &AppSessionConfig,
    now_unix_seconds: i64,
) -> Result<TrustedRequestSubject, AppSessionTokenError> {
    let authorization = headers
        .get(AUTHORIZATION)
        .ok_or(AppSessionTokenError::MissingBearerToken)?
        .to_str()
        .map_err(|_| AppSessionTokenError::InvalidHeaderValue(AUTHORIZATION))?;
    let auth_subject =
        verify_app_session_authorization_header(config, authorization, now_unix_seconds)?;

    let access_token = headers
        .get(SDKWORK_ACCESS_TOKEN)
        .ok_or(AppSessionTokenError::MissingAccessToken)?
        .to_str()
        .map(str::trim)
        .map_err(|_| AppSessionTokenError::InvalidHeaderValue(SDKWORK_ACCESS_TOKEN))?;
    if access_token.is_empty() {
        return Err(AppSessionTokenError::MissingAccessToken);
    }
    let access_subject = verify_app_session_token(config, access_token, now_unix_seconds)?;
    if auth_subject != access_subject {
        return Err(AppSessionTokenError::SubjectMismatch);
    }
    Ok(auth_subject)
}

pub fn verify_app_session_token(
    config: &AppSessionConfig,
    token: &str,
    now_unix_seconds: i64,
) -> Result<TrustedRequestSubject, AppSessionTokenError> {
    let parts: Vec<&str> = token.trim().split('.').collect();
    if parts.len() != 7 || parts[0] != APP_SESSION_TOKEN_VERSION {
        return Err(AppSessionTokenError::InvalidTokenFormat);
    }
    let tenant_id = parse_session_positive_i64(parts[1], "tenant_id")?;
    let organization_id = parse_session_positive_i64(parts[2], "organization_id")?;
    let user_id = parse_session_positive_i64(parts[3], "user_id")?;
    let issued_at = parse_session_timestamp(parts[4], "issued_at")?;
    let expires_at = parse_session_timestamp(parts[5], "expires_at")?;
    if expires_at <= issued_at {
        return Err(AppSessionTokenError::InvalidTimestamp("expires_at"));
    }
    validate_app_session_time_window(config, issued_at, expires_at, now_unix_seconds)?;
    let subject = TrustedRequestSubject {
        tenant_id,
        organization_id,
        user_id,
        operator_id: user_id,
        operator_type: DEFAULT_USER_OPERATOR_TYPE,
    };
    verify_app_session_signature(config, subject, issued_at, expires_at, parts[6])?;
    Ok(subject)
}

impl fmt::Display for TrustedSubjectBoundaryError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::MissingHeader(name) => {
                write!(formatter, "{name} header is required for trusted subject")
            }
            Self::InvalidHeaderValue(name) => write!(formatter, "{name} header value is invalid"),
            Self::InvalidPositiveInteger(name) => {
                write!(formatter, "{name} header must be a positive integer")
            }
            Self::InvalidTimestamp => {
                write!(
                    formatter,
                    "{X_SDKWORK_SUBJECT_TIMESTAMP} header must be a positive unix timestamp"
                )
            }
            Self::TimestampOutsideClockSkew => {
                write!(
                    formatter,
                    "trusted subject timestamp is outside allowed clock skew"
                )
            }
            Self::InvalidSignature => write!(formatter, "trusted subject signature is invalid"),
        }
    }
}

impl std::error::Error for TrustedSubjectBoundaryError {}

impl fmt::Display for AppSessionTokenError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::MissingBearerToken => write!(formatter, "app session bearer token is required"),
            Self::MissingAccessToken => {
                write!(formatter, "{SDKWORK_ACCESS_TOKEN} header is required")
            }
            Self::InvalidAuthorizationScheme => {
                write!(
                    formatter,
                    "authorization header must use Bearer app session scheme"
                )
            }
            Self::InvalidHeaderValue(name) => write!(formatter, "{name} header value is invalid"),
            Self::InvalidTokenFormat => write!(formatter, "app session token format is invalid"),
            Self::InvalidPositiveInteger(field) => {
                write!(formatter, "app session {field} must be a positive integer")
            }
            Self::InvalidTimestamp(field) => {
                write!(
                    formatter,
                    "app session {field} must be a valid unix timestamp"
                )
            }
            Self::IssuedAtOutsideClockSkew => {
                write!(
                    formatter,
                    "app session issued_at is outside allowed clock skew"
                )
            }
            Self::Expired => write!(formatter, "app session token has expired"),
            Self::InvalidSignature => write!(formatter, "app session token signature is invalid"),
            Self::SubjectMismatch => write!(
                formatter,
                "app session auth token and access token subjects do not match"
            ),
        }
    }
}

impl std::error::Error for AppSessionTokenError {}

fn unauthorized_boundary_response(message: String) -> Response {
    (
        StatusCode::UNAUTHORIZED,
        Json(BoundaryErrorEnvelope {
            code: "4010",
            msg: message,
            data: None,
        }),
    )
        .into_response()
}

fn current_unix_seconds() -> Result<i64, String> {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .map_err(|error| {
            tracing::error!("system clock error: unable to determine current unix time: {error}");
            format!("system clock error: unable to determine current unix time: {error}")
        })
}

fn remove_internal_trusted_subject_headers(headers: &mut HeaderMap) {
    headers.remove(X_SDKWORK_TENANT_ID);
    headers.remove(X_SDKWORK_ORGANIZATION_ID);
    headers.remove(X_SDKWORK_USER_ID);
}

fn has_dual_app_session_token_headers(headers: &HeaderMap) -> bool {
    headers.contains_key(AUTHORIZATION) && headers.contains_key(SDKWORK_ACCESS_TOKEN)
}

fn remove_app_session_token_headers(headers: &mut HeaderMap) {
    headers.remove(AUTHORIZATION);
    headers.remove(SDKWORK_ACCESS_TOKEN);
}

fn has_any_signed_subject_header(headers: &HeaderMap) -> bool {
    [
        X_SDKWORK_SUBJECT_TENANT_ID,
        X_SDKWORK_SUBJECT_ORGANIZATION_ID,
        X_SDKWORK_SUBJECT_USER_ID,
        X_SDKWORK_SUBJECT_TIMESTAMP,
        X_SDKWORK_SUBJECT_SIGNATURE,
    ]
    .iter()
    .any(|name| headers.contains_key(*name))
}

fn remove_signed_subject_headers(headers: &mut HeaderMap) {
    headers.remove(X_SDKWORK_SUBJECT_TENANT_ID);
    headers.remove(X_SDKWORK_SUBJECT_ORGANIZATION_ID);
    headers.remove(X_SDKWORK_SUBJECT_USER_ID);
    headers.remove(X_SDKWORK_SUBJECT_TIMESTAMP);
    headers.remove(X_SDKWORK_SUBJECT_SIGNATURE);
}

fn required_signed_header<'a>(
    headers: &'a HeaderMap,
    name: &'static str,
) -> Result<&'a str, TrustedSubjectBoundaryError> {
    headers
        .get(name)
        .ok_or(TrustedSubjectBoundaryError::MissingHeader(name))?
        .to_str()
        .map(str::trim)
        .map_err(|_| TrustedSubjectBoundaryError::InvalidHeaderValue(name))
        .and_then(|value| {
            if value.is_empty() {
                Err(TrustedSubjectBoundaryError::InvalidHeaderValue(name))
            } else {
                Ok(value)
            }
        })
}

fn required_signed_positive_i64_header(
    headers: &HeaderMap,
    name: &'static str,
) -> Result<i64, TrustedSubjectBoundaryError> {
    let value = required_signed_header(headers, name)?;
    let parsed = value
        .parse::<i64>()
        .map_err(|_| TrustedSubjectBoundaryError::InvalidPositiveInteger(name))?;
    if parsed <= 0 {
        return Err(TrustedSubjectBoundaryError::InvalidPositiveInteger(name));
    }
    Ok(parsed)
}

fn required_signed_timestamp(headers: &HeaderMap) -> Result<i64, TrustedSubjectBoundaryError> {
    let value = required_signed_header(headers, X_SDKWORK_SUBJECT_TIMESTAMP)?;
    let parsed = value
        .parse::<i64>()
        .map_err(|_| TrustedSubjectBoundaryError::InvalidTimestamp)?;
    if parsed <= 0 {
        return Err(TrustedSubjectBoundaryError::InvalidTimestamp);
    }
    Ok(parsed)
}

fn validate_timestamp(
    timestamp: i64,
    now_unix_seconds: i64,
    config: &TrustedSubjectConfig,
) -> Result<(), TrustedSubjectBoundaryError> {
    let delta = if now_unix_seconds >= timestamp {
        now_unix_seconds - timestamp
    } else {
        timestamp - now_unix_seconds
    };
    if delta as u64 > config.max_clock_skew_seconds() {
        return Err(TrustedSubjectBoundaryError::TimestampOutsideClockSkew);
    }
    Ok(())
}

fn verify_trusted_request_subject_signature(
    config: &TrustedSubjectConfig,
    subject: TrustedRequestSubject,
    timestamp: i64,
    method: &str,
    path_and_query: &str,
    signature: &str,
) -> Result<(), TrustedSubjectBoundaryError> {
    let decoded_signature =
        hex::decode(signature).map_err(|_| TrustedSubjectBoundaryError::InvalidSignature)?;
    let mut mac = hmac_for_config(config);
    mac.update(trusted_subject_payload(subject, timestamp, method, path_and_query).as_bytes());
    mac.verify_slice(&decoded_signature)
        .map_err(|_| TrustedSubjectBoundaryError::InvalidSignature)
}

fn hmac_for_config(config: &TrustedSubjectConfig) -> HmacSha256 {
    HmacSha256::new_from_slice(config.signing_secret().as_bytes())
        .expect("HMAC accepts signing secrets of any length")
}

fn app_session_hmac_for_config(config: &AppSessionConfig) -> HmacSha256 {
    HmacSha256::new_from_slice(config.signing_secret().as_bytes())
        .expect("HMAC accepts signing secrets of any length")
}

fn app_session_payload(subject: TrustedRequestSubject, issued_at: i64, expires_at: i64) -> String {
    format!(
        "{}\n{}\n{}\n{}\n{}",
        subject.tenant_id, subject.organization_id, subject.user_id, issued_at, expires_at
    )
}

fn parse_session_positive_i64(
    value: &str,
    field: &'static str,
) -> Result<i64, AppSessionTokenError> {
    let parsed = value
        .parse::<i64>()
        .map_err(|_| AppSessionTokenError::InvalidPositiveInteger(field))?;
    if parsed <= 0 {
        return Err(AppSessionTokenError::InvalidPositiveInteger(field));
    }
    Ok(parsed)
}

fn parse_session_timestamp(value: &str, field: &'static str) -> Result<i64, AppSessionTokenError> {
    let parsed = value
        .parse::<i64>()
        .map_err(|_| AppSessionTokenError::InvalidTimestamp(field))?;
    if parsed <= 0 {
        return Err(AppSessionTokenError::InvalidTimestamp(field));
    }
    Ok(parsed)
}

fn validate_app_session_time_window(
    config: &AppSessionConfig,
    issued_at: i64,
    expires_at: i64,
    now_unix_seconds: i64,
) -> Result<(), AppSessionTokenError> {
    if issued_at - now_unix_seconds > config.max_clock_skew_seconds() as i64 {
        return Err(AppSessionTokenError::IssuedAtOutsideClockSkew);
    }
    if now_unix_seconds - expires_at > config.max_clock_skew_seconds() as i64 {
        return Err(AppSessionTokenError::Expired);
    }
    if (expires_at - issued_at) as u64 > config.session_ttl_seconds() {
        return Err(AppSessionTokenError::InvalidTimestamp("expires_at"));
    }
    Ok(())
}

fn verify_app_session_signature(
    config: &AppSessionConfig,
    subject: TrustedRequestSubject,
    issued_at: i64,
    expires_at: i64,
    signature: &str,
) -> Result<(), AppSessionTokenError> {
    let decoded_signature =
        hex::decode(signature).map_err(|_| AppSessionTokenError::InvalidSignature)?;
    let mut mac = app_session_hmac_for_config(config);
    mac.update(app_session_payload(subject, issued_at, expires_at).as_bytes());
    mac.verify_slice(&decoded_signature)
        .map_err(|_| AppSessionTokenError::InvalidSignature)
}

fn parse_app_session_authorization_bearer(
    authorization: &str,
) -> Result<&str, AppSessionTokenError> {
    let mut parts = authorization.split_whitespace();
    let Some(scheme) = parts.next() else {
        return Err(AppSessionTokenError::MissingBearerToken);
    };
    let Some(token) = parts.next() else {
        return Err(AppSessionTokenError::MissingBearerToken);
    };
    if parts.next().is_some() || !scheme.eq_ignore_ascii_case("bearer") {
        return Err(AppSessionTokenError::InvalidAuthorizationScheme);
    }
    Ok(token)
}

fn trusted_subject_payload(
    subject: TrustedRequestSubject,
    timestamp: i64,
    method: &str,
    path_and_query: &str,
) -> String {
    format!(
        "{}\n{}\n{}\n{}\n{}\n{}",
        subject.tenant_id,
        subject.organization_id,
        subject.user_id,
        timestamp,
        method.to_ascii_uppercase(),
        path_and_query
    )
}

fn insert_internal_trusted_subject_headers(
    headers: &mut HeaderMap,
    subject: TrustedRequestSubject,
) {
    headers.insert(
        X_SDKWORK_TENANT_ID,
        HeaderValue::from_str(&subject.tenant_id.to_string())
            .expect("tenant id header value must be valid"),
    );
    headers.insert(
        X_SDKWORK_ORGANIZATION_ID,
        HeaderValue::from_str(&subject.organization_id.to_string())
            .expect("organization id header value must be valid"),
    );
    headers.insert(
        X_SDKWORK_USER_ID,
        HeaderValue::from_str(&subject.user_id.to_string())
            .expect("user id header value must be valid"),
    );
}

fn required_positive_i64_header(
    headers: &HeaderMap,
    name: &'static str,
) -> Result<i64, TrustedRequestSubjectError> {
    let value = headers
        .get(name)
        .ok_or(TrustedRequestSubjectError::MissingHeader(name))?
        .to_str()
        .map_err(|_| TrustedRequestSubjectError::InvalidHeaderValue(name))?
        .trim();
    let parsed = value
        .parse::<i64>()
        .map_err(|_| TrustedRequestSubjectError::InvalidPositiveInteger(name))?;
    if parsed <= 0 {
        return Err(TrustedRequestSubjectError::InvalidPositiveInteger(name));
    }
    Ok(parsed)
}

fn parse_api_key_id(headers: &HeaderMap) -> Result<Option<i64>, ApiKeyIdentityError> {
    let Some(value) = header_value(headers, X_SDKWORK_API_KEY_ID)? else {
        return Ok(None);
    };
    let api_key_id = value
        .trim()
        .parse::<i64>()
        .map_err(|_| ApiKeyIdentityError::InvalidApiKeyId)?;
    if api_key_id <= 0 {
        return Err(ApiKeyIdentityError::InvalidApiKeyId);
    }
    Ok(Some(api_key_id))
}

fn parse_credential(
    headers: &HeaderMap,
    uri: &Uri,
) -> Result<Option<ApiKeyCredential>, ApiKeyIdentityError> {
    if let Some(value) = header_value(headers, AUTHORIZATION)? {
        return parse_authorization_bearer(value).map(Some);
    }
    if let Some(value) = header_value(headers, X_API_KEY)? {
        return credential(value, ApiKeyCredentialSource::ApiKeyHeader).map(Some);
    }
    if let Some(value) = header_value(headers, X_GOOG_API_KEY)? {
        return credential(value, ApiKeyCredentialSource::GoogleApiKeyHeader).map(Some);
    }
    query_key(uri)
        .map(|value| credential(value, ApiKeyCredentialSource::QueryKey))
        .transpose()
}

fn parse_authorization_bearer(value: &str) -> Result<ApiKeyCredential, ApiKeyIdentityError> {
    let mut parts = value.split_whitespace();
    let Some(scheme) = parts.next() else {
        return Err(ApiKeyIdentityError::EmptyCredential(
            ApiKeyCredentialSource::AuthorizationBearer,
        ));
    };
    let Some(secret) = parts.next() else {
        return Err(ApiKeyIdentityError::EmptyCredential(
            ApiKeyCredentialSource::AuthorizationBearer,
        ));
    };
    if parts.next().is_some() || !scheme.eq_ignore_ascii_case("bearer") {
        return Err(ApiKeyIdentityError::InvalidAuthorizationScheme);
    }
    credential(secret, ApiKeyCredentialSource::AuthorizationBearer)
}

fn credential(
    value: &str,
    source: ApiKeyCredentialSource,
) -> Result<ApiKeyCredential, ApiKeyIdentityError> {
    let secret = value.trim();
    if secret.is_empty() {
        return Err(ApiKeyIdentityError::EmptyCredential(source));
    }
    Ok(ApiKeyCredential {
        secret: secret.to_owned(),
        source,
    })
}

fn header_value<'a>(
    headers: &'a HeaderMap,
    name: &'static str,
) -> Result<Option<&'a str>, ApiKeyIdentityError> {
    headers
        .get(name)
        .map(|value| {
            value
                .to_str()
                .map_err(|_| ApiKeyIdentityError::InvalidHeaderValue(name))
        })
        .transpose()
}

fn query_key(uri: &Uri) -> Option<&str> {
    uri.query()?.split('&').find_map(|pair| {
        let (name, value) = pair.split_once('=')?;
        (name == "key").then_some(value)
    })
}
