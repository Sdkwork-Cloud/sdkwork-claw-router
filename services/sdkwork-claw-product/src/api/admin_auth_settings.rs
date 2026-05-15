use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Bytes;
use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_claw_http::TrustedRequestSubject;
use serde::{Deserialize, Serialize};

use crate::api::response::PlusApiResult;
use crate::application::EntityUuidGenerator;
use crate::domain::DomainError;
use crate::ports::{
    AdminAuthSettings, AdminAuthSettingsStore, AdminAuthSettingsSubject,
    AdminAuthVerificationPolicy, GetAdminAuthSettingsQuery, UpdateAdminAuthSettingsCommand,
};

const MAX_REQUEST_ID_LEN: usize = 128;
const REQUEST_ID_HEADER: &str = "X-Request-Id";

#[derive(Clone)]
struct AdminAuthSettingsState {
    store: Arc<dyn AdminAuthSettingsStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminAuthSettingsUpdateRequest {
    left_rail_mode: Option<String>,
    login_methods: Option<Vec<String>>,
    oauth_login_enabled: Option<bool>,
    oauth_providers: Option<Vec<String>>,
    oauth_region: Option<String>,
    qr_login_enabled: Option<bool>,
    recovery_methods: Option<Vec<String>>,
    register_methods: Option<Vec<String>>,
    verification_policy: Option<AdminAuthVerificationPolicyUpdateRequest>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminAuthVerificationPolicyUpdateRequest {
    email_code_login_enabled: Option<bool>,
    email_registration_verification_required: Option<bool>,
    phone_code_login_enabled: Option<bool>,
    phone_registration_verification_required: Option<bool>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAuthSettingsResponse {
    left_rail_mode: String,
    login_methods: Vec<String>,
    oauth_login_enabled: bool,
    oauth_providers: Vec<String>,
    oauth_region: String,
    qr_login_enabled: bool,
    recovery_methods: Vec<String>,
    register_methods: Vec<String>,
    verification_policy: AdminAuthVerificationPolicyResponse,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminAuthVerificationPolicyResponse {
    email_code_login_enabled: bool,
    email_registration_verification_required: bool,
    phone_code_login_enabled: bool,
    phone_registration_verification_required: bool,
}

enum AuthSettingsCommandBuildError {
    BadRequest(String),
    System(DomainError),
}

pub fn admin_auth_settings_router_with_store(
    store: Arc<dyn AdminAuthSettingsStore + Send + Sync>,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> Router {
    Router::new()
        .route(
            "/backend/v3/api/system/auth/settings",
            get(fetch_auth_settings).patch(update_auth_settings),
        )
        .with_state(AdminAuthSettingsState {
            store,
            entity_uuid_generator,
        })
}

async fn fetch_auth_settings(
    State(state): State<AdminAuthSettingsState>,
    headers: HeaderMap,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };

    match state
        .store
        .get_auth_settings(GetAdminAuthSettingsQuery { subject })
        .await
    {
        Ok(settings) => Json(PlusApiResult::success(to_response(settings))).into_response(),
        Err(error) => {
            auth_settings_system_response("auth settings read model is unavailable", error)
        }
    }
}

async fn update_auth_settings(
    State(state): State<AdminAuthSettingsState>,
    headers: HeaderMap,
    body: Bytes,
) -> Response {
    let subject = match resolve_subject(&headers) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let request = match parse_json_body::<AdminAuthSettingsUpdateRequest>(&body, "auth settings") {
        Ok(request) => request,
        Err(message) => return bad_request(message),
    };
    let current = match state
        .store
        .get_auth_settings(GetAdminAuthSettingsQuery { subject })
        .await
    {
        Ok(settings) => settings,
        Err(error) => {
            return auth_settings_system_response("auth settings read model is unavailable", error)
        }
    };
    let settings = match merge_update_request(current, request) {
        Ok(settings) => settings,
        Err(message) => return bad_request(message),
    };
    let command = match build_update_command(state.clone(), &headers, subject, settings) {
        Ok(command) => command,
        Err(error) => return command_build_error_response(error),
    };

    match state.store.update_auth_settings(command).await {
        Ok(settings) => Json(PlusApiResult::success(to_response(settings))).into_response(),
        Err(error) => {
            auth_settings_system_response("auth settings command store is unavailable", error)
        }
    }
}

fn resolve_subject(headers: &HeaderMap) -> Result<AdminAuthSettingsSubject, Response> {
    TrustedRequestSubject::from_headers(headers)
        .map(|subject| AdminAuthSettingsSubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            operator_id: subject.operator_id,
            operator_type: subject.operator_type,
        })
        .map_err(|error| {
            (
                StatusCode::UNAUTHORIZED,
                Json(PlusApiResult::error("4010", error.to_string())),
            )
                .into_response()
        })
}

fn parse_json_body<T>(body: &[u8], entity_name: &str) -> Result<T, String>
where
    T: for<'de> Deserialize<'de>,
{
    if body.iter().all(u8::is_ascii_whitespace) {
        return Err(format!("{entity_name} request body is required"));
    }
    serde_json::from_slice(body)
        .map_err(|error| format!("invalid {entity_name} request body: {error}"))
}

fn merge_update_request(
    mut current: AdminAuthSettings,
    request: AdminAuthSettingsUpdateRequest,
) -> Result<AdminAuthSettings, String> {
    if let Some(value) = request.left_rail_mode {
        current.left_rail_mode = normalize_enum(
            &value,
            "leftRailMode",
            &["auto", "highlights-only", "qr-only"],
        )?;
    }
    if let Some(value) = request.login_methods {
        current.login_methods = normalize_enum_array(
            value,
            "loginMethods",
            &["password", "emailCode", "phoneCode", "sessionBridge"],
            8,
        )?;
    }
    if let Some(value) = request.oauth_login_enabled {
        current.oauth_login_enabled = value;
    }
    if let Some(value) = request.oauth_providers {
        current.oauth_providers = normalize_oauth_providers(value)?;
    }
    if let Some(value) = request.oauth_region {
        current.oauth_region = normalize_enum(&value, "oauthRegion", &["mainland", "overseas"])?;
    }
    if let Some(value) = request.qr_login_enabled {
        current.qr_login_enabled = value;
    }
    if let Some(value) = request.recovery_methods {
        current.recovery_methods =
            normalize_enum_array(value, "recoveryMethods", &["email", "phone"], 4)?;
    }
    if let Some(value) = request.register_methods {
        current.register_methods =
            normalize_enum_array(value, "registerMethods", &["email", "phone"], 4)?;
    }
    if let Some(value) = request.verification_policy {
        current.verification_policy = merge_verification_policy(current.verification_policy, value);
    }
    Ok(current.normalized())
}

fn merge_verification_policy(
    mut current: AdminAuthVerificationPolicy,
    request: AdminAuthVerificationPolicyUpdateRequest,
) -> AdminAuthVerificationPolicy {
    if let Some(value) = request.email_code_login_enabled {
        current.email_code_login_enabled = value;
    }
    if let Some(value) = request.email_registration_verification_required {
        current.email_registration_verification_required = value;
    }
    if let Some(value) = request.phone_code_login_enabled {
        current.phone_code_login_enabled = value;
    }
    if let Some(value) = request.phone_registration_verification_required {
        current.phone_registration_verification_required = value;
    }
    current
}

fn normalize_enum(value: &str, field_name: &str, allowed: &[&str]) -> Result<String, String> {
    let value = value.trim();
    if allowed.contains(&value) {
        Ok(value.to_owned())
    } else {
        Err(format!(
            "{field_name} must be one of {}",
            allowed.join(", ")
        ))
    }
}

fn normalize_enum_array(
    values: Vec<String>,
    field_name: &str,
    allowed: &[&str],
    max_items: usize,
) -> Result<Vec<String>, String> {
    if values.is_empty() {
        return Err(format!("{field_name} must include at least one item"));
    }
    if values.len() > max_items {
        return Err(format!(
            "{field_name} must include at most {max_items} items"
        ));
    }
    let mut normalized = Vec::new();
    for value in values {
        let value = normalize_enum(&value, field_name, allowed)?;
        if !normalized.contains(&value) {
            normalized.push(value);
        }
    }
    if normalized.is_empty() {
        return Err(format!("{field_name} must include at least one valid item"));
    }
    Ok(normalized)
}

fn normalize_oauth_providers(values: Vec<String>) -> Result<Vec<String>, String> {
    if values.len() > 16 {
        return Err("oauthProviders must include at most 16 items".to_owned());
    }
    let mut normalized = Vec::new();
    for value in values {
        let value = value.trim();
        if value.is_empty() {
            continue;
        }
        if value.chars().count() > 64
            || !value
                .bytes()
                .all(|byte| byte.is_ascii_alphanumeric() || byte == b'_' || byte == b'-')
        {
            return Err(
                "oauthProviders items must be 64 characters or fewer and use letters, digits, underscore, or hyphen"
                    .to_owned(),
            );
        }
        let value = value.to_owned();
        if !normalized.contains(&value) {
            normalized.push(value);
        }
    }
    Ok(normalized)
}

fn build_update_command(
    state: AdminAuthSettingsState,
    headers: &HeaderMap,
    subject: AdminAuthSettingsSubject,
    settings: AdminAuthSettings,
) -> Result<UpdateAdminAuthSettingsCommand, AuthSettingsCommandBuildError> {
    Ok(UpdateAdminAuthSettingsCommand {
        subject,
        audit_log_uuid: generate_entity_uuid(&state)?,
        config_snapshot_uuid: generate_entity_uuid(&state)?,
        settings,
        request_id: normalize_request_id(headers, &state)?,
        requested_at: current_timestamp_string(),
    })
}

fn generate_entity_uuid(
    state: &AdminAuthSettingsState,
) -> Result<String, AuthSettingsCommandBuildError> {
    state
        .entity_uuid_generator
        .generate_entity_uuid()
        .map_err(AuthSettingsCommandBuildError::System)
}

fn normalize_request_id(
    headers: &HeaderMap,
    state: &AdminAuthSettingsState,
) -> Result<String, AuthSettingsCommandBuildError> {
    if let Some(value) = header_value(headers, REQUEST_ID_HEADER) {
        if value.chars().count() > MAX_REQUEST_ID_LEN
            || !value.bytes().all(|byte| (0x21..=0x7e).contains(&byte))
        {
            return Err(AuthSettingsCommandBuildError::BadRequest(format!(
                "{REQUEST_ID_HEADER} must be visible ASCII and at most {MAX_REQUEST_ID_LEN} characters"
            )));
        }
        return Ok(value.to_owned());
    }
    generate_entity_uuid(state)
}

fn header_value<'a>(headers: &'a HeaderMap, name: &str) -> Option<&'a str> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| !value.is_empty())
}

fn to_response(settings: AdminAuthSettings) -> AdminAuthSettingsResponse {
    AdminAuthSettingsResponse {
        left_rail_mode: settings.left_rail_mode,
        login_methods: settings.login_methods,
        oauth_login_enabled: settings.oauth_login_enabled,
        oauth_providers: settings.oauth_providers,
        oauth_region: settings.oauth_region,
        qr_login_enabled: settings.qr_login_enabled,
        recovery_methods: settings.recovery_methods,
        register_methods: settings.register_methods,
        verification_policy: AdminAuthVerificationPolicyResponse {
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

fn bad_request(message: String) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(PlusApiResult::error("4001", message)),
    )
        .into_response()
}

fn command_build_error_response(error: AuthSettingsCommandBuildError) -> Response {
    match error {
        AuthSettingsCommandBuildError::BadRequest(message) => bad_request(message),
        AuthSettingsCommandBuildError::System(error) => {
            auth_settings_system_response("auth settings command is invalid", error)
        }
    }
}

fn auth_settings_system_response(context: &str, error: DomainError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(PlusApiResult::error("5000", format!("{context}: {error}"))),
    )
        .into_response()
}

fn current_timestamp_string() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0);
    format_unix_timestamp(seconds)
}

fn format_unix_timestamp(seconds: i64) -> String {
    let days = seconds.div_euclid(86_400);
    let seconds_of_day = seconds.rem_euclid(86_400);
    let (year, month, day) = civil_from_days(days);
    let hour = seconds_of_day / 3_600;
    let minute = (seconds_of_day % 3_600) / 60;
    let second = seconds_of_day % 60;
    format!("{year:04}-{month:02}-{day:02} {hour:02}:{minute:02}:{second:02}")
}

fn civil_from_days(days: i64) -> (i64, i64, i64) {
    let days = days + 719_468;
    let era = if days >= 0 { days } else { days - 146_096 } / 146_097;
    let day_of_era = days - era * 146_097;
    let year_of_era =
        (day_of_era - day_of_era / 1_460 + day_of_era / 36_524 - day_of_era / 146_096) / 365;
    let year = year_of_era + era * 400;
    let day_of_year = day_of_era - (365 * year_of_era + year_of_era / 4 - year_of_era / 100);
    let month_prime = (5 * day_of_year + 2) / 153;
    let day = day_of_year - (153 * month_prime + 2) / 5 + 1;
    let month = month_prime + if month_prime < 10 { 3 } else { -9 };
    let year = year + if month <= 2 { 1 } else { 0 };
    (year, month, day)
}
