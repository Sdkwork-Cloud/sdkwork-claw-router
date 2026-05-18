use std::sync::Arc;

use crate::api::base::{RequestHeaders};
use crate::api::paths::app_path;
use crate::api::paths::append_query_string;
use crate::http::{SdkworkError, SdkworkHttpClient};
use crate::models::{IamCurrentSessionUpdateRequest, IamLoginQrCodeConfirmRequest, IamOauthSessionCreateRequest, IamPasswordResetCreateRequest, IamPasswordResetRequestCreateRequest, IamRegistrationCreateRequest, IamSessionCreateRequest, IamSessionRefreshRequest, IamVerificationCodeCreateRequest, IamVerificationCodeVerifyRequest, LoginQrCodesConfirmResult, LoginQrCodesCreateResult, LoginQrCodesRetrieveResult, OauthAuthorizationUrlsRetrieveResult, OauthSessionsCreateResult, PasswordResetRequestsCreateResult, PasswordResetsCreateResult, RegistrationsCreateResult, RuntimeSettingsRetrieveResult, SessionsCreateResult, SessionsCurrentDeleteResult, SessionsCurrentRetrieveResult, SessionsCurrentUpdateResult, SessionsRefreshResult, VerificationCodesCreateResult, VerificationCodesVerifyResult, VerificationPolicyRetrieveResult};

#[derive(Clone)]
pub struct AuthApi {
    client: Arc<SdkworkHttpClient>,
}

impl AuthApi {
    pub fn new(client: Arc<SdkworkHttpClient>) -> Self {
        Self { client }
    }

    /// Retrieve OAuth authorization URL
    pub async fn oauth_authorization_urls_retrieve(&self, provider: &str, redirect_uri: &str, state: Option<&str>, scope: Option<&str>) -> Result<OauthAuthorizationUrlsRetrieveResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("provider", provider, "form", true, false, None),
            QueryParameterSpec::new("redirect_uri", redirect_uri, "form", true, false, None),
            QueryParameterSpec::new("state", state, "form", true, false, None),
            QueryParameterSpec::new("scope", scope, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/auth/oauth_authorization_urls".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create OAuth IAM session
    pub async fn oauth_sessions_create(&self, body: &IamOauthSessionCreateRequest) -> Result<OauthSessionsCreateResult, SdkworkError> {
        let path = app_path(&"/auth/oauth_sessions".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Create password reset request
    pub async fn password_reset_requests_create(&self, body: &IamPasswordResetRequestCreateRequest) -> Result<PasswordResetRequestsCreateResult, SdkworkError> {
        let path = app_path(&"/auth/password_reset_requests".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Create password reset
    pub async fn password_resets_create(&self, body: &IamPasswordResetCreateRequest) -> Result<PasswordResetsCreateResult, SdkworkError> {
        let path = app_path(&"/auth/password_resets".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Create QR login code
    pub async fn login_qr_codes_create(&self) -> Result<LoginQrCodesCreateResult, SdkworkError> {
        let path = app_path(&"/auth/qr_login_codes".to_string());
        self.client.post(&path, Option::<&serde_json::Value>::None, None, None, None).await
    }

    /// Confirm QR login code
    pub async fn login_qr_codes_confirm(&self, body: &IamLoginQrCodeConfirmRequest) -> Result<LoginQrCodesConfirmResult, SdkworkError> {
        let path = app_path(&"/auth/qr_login_codes/confirm".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Retrieve QR login status
    pub async fn login_qr_codes_retrieve(&self, qr_key: &str) -> Result<LoginQrCodesRetrieveResult, SdkworkError> {
        let path = app_path(&format!("/auth/qr_login_codes/{}", serialize_path_parameter(qr_key, PathParameterSpec::new("qrKey", "simple", false))));
        self.client.get(&path, None, None).await
    }

    /// Create IAM registration
    pub async fn registrations_create(&self, body: &IamRegistrationCreateRequest, x_request_id: Option<&str>) -> Result<RegistrationsCreateResult, SdkworkError> {
        let path = app_path(&"/auth/registrations".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Retrieve public IAM auth runtime settings
    pub async fn runtime_settings_retrieve(&self, tenant_code: Option<&str>, organization_code: Option<&str>) -> Result<RuntimeSettingsRetrieveResult, SdkworkError> {
        let query = build_query_string(&[
            QueryParameterSpec::new("tenant_code", tenant_code, "form", true, false, None),
            QueryParameterSpec::new("organization_code", organization_code, "form", true, false, None),
        ]);
        let path = append_query_string(app_path(&"/auth/runtime_settings".to_string()), &query);
        self.client.get(&path, None, None).await
    }

    /// Create IAM session
    pub async fn sessions_create(&self, body: &IamSessionCreateRequest, x_request_id: Option<&str>) -> Result<SessionsCreateResult, SdkworkError> {
        let path = app_path(&"/auth/sessions".to_string());
        let headers = build_request_headers(
            &[
                ("X-Request-Id", HeaderParameterSpec::new(x_request_id, "simple", false, None)),
            ],
            &[],
        );
        self.client.post(&path, Some(body), None, headers.as_ref(), Some("application/json")).await
    }

    /// Delete current IAM session
    pub async fn sessions_current_delete(&self) -> Result<SessionsCurrentDeleteResult, SdkworkError> {
        let path = app_path(&"/auth/sessions/current".to_string());
        self.client.delete(&path, None, None).await
    }

    /// Retrieve current IAM session
    pub async fn sessions_current_retrieve(&self) -> Result<SessionsCurrentRetrieveResult, SdkworkError> {
        let path = app_path(&"/auth/sessions/current".to_string());
        self.client.get(&path, None, None).await
    }

    /// Update current IAM session
    pub async fn sessions_current_update(&self, body: &IamCurrentSessionUpdateRequest) -> Result<SessionsCurrentUpdateResult, SdkworkError> {
        let path = app_path(&"/auth/sessions/current".to_string());
        self.client.patch(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Refresh IAM session
    pub async fn sessions_refresh(&self, body: &IamSessionRefreshRequest) -> Result<SessionsRefreshResult, SdkworkError> {
        let path = app_path(&"/auth/sessions/refresh".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Create verification code
    pub async fn verification_codes_create(&self, body: &IamVerificationCodeCreateRequest) -> Result<VerificationCodesCreateResult, SdkworkError> {
        let path = app_path(&"/auth/verification_codes".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Verify verification code
    pub async fn verification_codes_verify(&self, body: &IamVerificationCodeVerifyRequest) -> Result<VerificationCodesVerifyResult, SdkworkError> {
        let path = app_path(&"/auth/verification_codes/verify".to_string());
        self.client.post(&path, Some(body), None, None, Some("application/json")).await
    }

    /// Retrieve public IAM verification policy
    pub async fn verification_policy_retrieve(&self) -> Result<VerificationPolicyRetrieveResult, SdkworkError> {
        let path = app_path(&"/auth/verification_policy".to_string());
        self.client.get(&path, None, None).await
    }

}

struct PathParameterSpec<'a> {
    name: &'a str,
    style: &'a str,
    explode: bool,
}

impl<'a> PathParameterSpec<'a> {
    fn new(name: &'a str, style: &'a str, explode: bool) -> Self {
        Self { name, style, explode }
    }
}

fn serialize_path_parameter<T: serde::Serialize>(value: T, spec: PathParameterSpec<'_>) -> String {
    let value = serde_json::to_value(value).unwrap_or(serde_json::Value::Null);
    if value.is_null() {
        return String::new();
    }
    let style = if spec.style.is_empty() { "simple" } else { spec.style };
    match value {
        serde_json::Value::Array(values) => serialize_path_array(spec.name, &values, style, spec.explode),
        serde_json::Value::Object(values) => serialize_path_object(spec.name, &values, style, spec.explode),
        value => format!("{}{}", path_primitive_prefix(spec.name, style), percent_encode(&primitive_to_string(&value))),
    }
}

fn serialize_path_array(name: &str, values: &[serde_json::Value], style: &str, explode: bool) -> String {
    let serialized = values
        .iter()
        .filter(|value| !value.is_null())
        .map(|value| percent_encode(&primitive_to_string(value)))
        .collect::<Vec<_>>();
    if serialized.is_empty() {
        return path_prefix(name, style);
    }
    if style == "matrix" {
        if explode {
            return serialized.iter().map(|item| format!(";{}={}", name, item)).collect::<Vec<_>>().join("");
        }
        return format!(";{}={}", name, serialized.join(","));
    }
    let separator = if explode { "." } else { "," };
    format!("{}{}", path_prefix(name, style), serialized.join(separator))
}

fn serialize_path_object(
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    style: &str,
    explode: bool,
) -> String {
    let mut entries = Vec::new();
    let mut exploded = Vec::new();
    for (key, value) in values {
        if value.is_null() {
            continue;
        }
        let escaped_key = percent_encode(key);
        let escaped_value = percent_encode(&primitive_to_string(value));
        if explode {
            if style == "matrix" {
                exploded.push(format!(";{}={}", escaped_key, escaped_value));
            } else {
                exploded.push(format!("{}={}", escaped_key, escaped_value));
            }
        } else {
            entries.push(escaped_key);
            entries.push(escaped_value);
        }
    }
    if style == "matrix" {
        if explode {
            return exploded.join("");
        }
        return format!(";{}={}", name, entries.join(","));
    }
    if explode {
        let separator = if style == "label" { "." } else { "," };
        return format!("{}{}", path_prefix(name, style), exploded.join(separator));
    }
    format!("{}{}", path_prefix(name, style), entries.join(","))
}

fn path_prefix(name: &str, style: &str) -> String {
    match style {
        "label" => ".".to_string(),
        "matrix" => format!(";{}", name),
        _ => String::new(),
    }
}

fn path_primitive_prefix(name: &str, style: &str) -> String {
    if style == "matrix" {
        format!(";{}=", name)
    } else {
        path_prefix(name, style)
    }
}

struct HeaderParameterSpec {
    value: serde_json::Value,
    explode: bool,
    content_type: Option<&'static str>,
}

impl HeaderParameterSpec {
    fn new<T: serde::Serialize>(
        value: T,
        _style: &'static str,
        explode: bool,
        content_type: Option<&'static str>,
    ) -> Self {
        Self {
            value: serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
            explode,
            content_type,
        }
    }
}

fn build_request_headers(headers: &[(&str, HeaderParameterSpec)], cookies: &[(&str, HeaderParameterSpec)]) -> Option<RequestHeaders> {
    let mut request_headers = RequestHeaders::new();
    for (name, parameter) in headers {
        if let Some(value) = serialize_header_parameter(parameter) {
            request_headers.insert((*name).to_string(), value);
        }
    }

    let cookie_header = build_cookie_header(cookies);
    if !cookie_header.is_empty() {
        request_headers
            .entry("Cookie".to_string())
            .and_modify(|existing| {
                existing.push_str("; ");
                existing.push_str(&cookie_header);
            })
            .or_insert(cookie_header);
    }

    if request_headers.is_empty() {
        None
    } else {
        Some(request_headers)
    }
}

fn build_cookie_header(cookies: &[(&str, HeaderParameterSpec)]) -> String {
    cookies
        .iter()
        .filter_map(|(name, value)| {
            serialize_header_parameter(value)
                .map(|value| format!("{}={}", percent_encode(name), percent_encode(&value)))
        })
        .collect::<Vec<_>>()
        .join("; ")
}

fn serialize_header_parameter(parameter: &HeaderParameterSpec) -> Option<String> {
    if parameter.value.is_null() {
        return None;
    }
    if parameter.content_type.is_some() {
        return Some(parameter.value.to_string());
    }
    match &parameter.value {
        serde_json::Value::Null => None,
        serde_json::Value::String(value) => Some(value.clone()),
        serde_json::Value::Number(value) => Some(value.to_string()),
        serde_json::Value::Bool(value) => Some(value.to_string()),
        serde_json::Value::Array(values) => {
            let serialized = values
                .iter()
                .filter_map(serialize_json_value)
                .collect::<Vec<_>>();
            if serialized.is_empty() {
                None
            } else {
                Some(serialized.join(","))
            }
        }
        serde_json::Value::Object(values) => {
            let serialized = values
                .iter()
                .filter_map(|(key, value)| {
                    serialize_json_value(value).map(|serialized| {
                        if parameter.explode {
                            format!("{}={}", key, serialized)
                        } else {
                            format!("{},{}", key, serialized)
                        }
                    })
                })
                .collect::<Vec<_>>();
            if serialized.is_empty() {
                None
            } else {
                Some(serialized.join(","))
            }
        }
    }
}

fn serialize_json_value(value: &serde_json::Value) -> Option<String> {
    match value {
        serde_json::Value::Null => None,
        serde_json::Value::String(value) => Some(value.clone()),
        serde_json::Value::Number(value) => Some(value.to_string()),
        serde_json::Value::Bool(value) => Some(value.to_string()),
        other => Some(other.to_string()),
    }
}

struct QueryParameterSpec<'a> {
    name: &'a str,
    value: serde_json::Value,
    style: &'a str,
    explode: bool,
    allow_reserved: bool,
    content_type: Option<&'a str>,
}

impl<'a> QueryParameterSpec<'a> {
    fn new<T: serde::Serialize>(
        name: &'a str,
        value: T,
        style: &'a str,
        explode: bool,
        allow_reserved: bool,
        content_type: Option<&'a str>,
    ) -> Self {
        Self {
            name,
            value: serde_json::to_value(value).unwrap_or(serde_json::Value::Null),
            style,
            explode,
            allow_reserved,
            content_type,
        }
    }
}

fn build_query_string(parameters: &[QueryParameterSpec<'_>]) -> String {
    let mut pairs = Vec::new();
    for parameter in parameters {
        append_serialized_parameter(&mut pairs, parameter);
    }
    pairs.join("&")
}

fn append_serialized_parameter(pairs: &mut Vec<String>, parameter: &QueryParameterSpec<'_>) {
    if parameter.value.is_null() {
        return;
    }
    if parameter.content_type.is_some() {
        pairs.push(format!(
            "{}={}",
            percent_encode(parameter.name),
            encode_query_value(&parameter.value.to_string(), parameter.allow_reserved)
        ));
        return;
    }

    let style = if parameter.style.is_empty() { "form" } else { parameter.style };
    match &parameter.value {
        serde_json::Value::Array(values) => append_array_parameter(pairs, parameter.name, values, style, parameter.explode, parameter.allow_reserved),
        serde_json::Value::Object(values) if style == "deepObject" => append_deep_object_parameter(pairs, parameter.name, values, parameter.allow_reserved),
        serde_json::Value::Object(values) => append_object_parameter(pairs, parameter.name, values, style, parameter.explode, parameter.allow_reserved),
        value => pairs.push(format!("{}={}", percent_encode(parameter.name), encode_query_value(&primitive_to_string(value), parameter.allow_reserved))),
    }
}

fn append_array_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &[serde_json::Value],
    style: &str,
    explode: bool,
    allow_reserved: bool,
) {
    let serialized = values.iter().filter(|value| !value.is_null()).map(primitive_to_string).collect::<Vec<_>>();
    if serialized.is_empty() {
        return;
    }
    if style == "form" && explode {
        for item in serialized {
            pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&item, allow_reserved)));
        }
        return;
    }
    pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&serialized.join(","), allow_reserved)));
}

fn append_object_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    style: &str,
    explode: bool,
    allow_reserved: bool,
) {
    let mut serialized = Vec::new();
    for (key, value) in values {
        if value.is_null() {
            continue;
        }
        if style == "form" && explode {
            pairs.push(format!("{}={}", percent_encode(key), encode_query_value(&primitive_to_string(value), allow_reserved)));
        } else {
            serialized.push(key.clone());
            serialized.push(primitive_to_string(value));
        }
    }
    if !serialized.is_empty() {
        pairs.push(format!("{}={}", percent_encode(name), encode_query_value(&serialized.join(","), allow_reserved)));
    }
}

fn append_deep_object_parameter(
    pairs: &mut Vec<String>,
    name: &str,
    values: &serde_json::Map<String, serde_json::Value>,
    allow_reserved: bool,
) {
    for (key, value) in values {
        if !value.is_null() {
            pairs.push(format!("{}={}", percent_encode(&format!("{}[{}]", name, key)), encode_query_value(&primitive_to_string(value), allow_reserved)));
        }
    }
}

fn encode_query_value(value: &str, allow_reserved: bool) -> String {
    let mut encoded = percent_encode(value);
    if !allow_reserved {
        return encoded;
    }
    for (escaped, reserved) in [
        ("%3A", ":"), ("%2F", "/"), ("%3F", "?"), ("%23", "#"),
        ("%5B", "["), ("%5D", "]"), ("%40", "@"), ("%21", "!"),
        ("%24", "$"), ("%26", "&"), ("%27", "'"), ("%28", "("),
        ("%29", ")"), ("%2A", "*"), ("%2B", "+"), ("%2C", ","),
        ("%3B", ";"), ("%3D", "="),
    ] {
        encoded = encoded.replace(escaped, reserved);
    }
    encoded
}

fn primitive_to_string(value: &serde_json::Value) -> String {
    match value {
        serde_json::Value::String(value) => value.clone(),
        serde_json::Value::Number(value) => value.to_string(),
        serde_json::Value::Bool(value) => value.to_string(),
        other => other.to_string(),
    }
}

fn percent_encode(value: &str) -> String {
    value
        .bytes()
        .flat_map(|byte| match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                vec![byte as char]
            }
            _ => format!("%{:02X}", byte).chars().collect(),
        })
        .collect()
}
