use std::collections::BTreeSet;

use serde_json::Value;

use crate::domain::{DomainError, DomainResult, ModelVendor};

pub const DEFAULT_PROVIDER_RETRY_ATTEMPTS: usize = 2;
pub const MAX_PROVIDER_RETRY_ATTEMPTS: usize = 5;
pub const MAX_PROVIDER_RETRY_BACKOFF_MS: u64 = 2_000;
pub const DEFAULT_RETRYABLE_PROVIDER_STATUS_CODES: [u16; 5] = [429, 500, 502, 503, 504];
pub const DEFAULT_PROVIDER_CIRCUIT_BREAKER_FAILURE_THRESHOLD: usize = 1;
pub const MAX_PROVIDER_CIRCUIT_BREAKER_FAILURE_THRESHOLD: usize = 100;
pub const DEFAULT_PROVIDER_CIRCUIT_BREAKER_RECOVERY_WINDOW_SECONDS: u64 = 60;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ModelVendorDefinition {
    pub vendor_code: String,
    pub vendor: ModelVendor,
    pub display_name: String,
}

impl ModelVendorDefinition {
    pub fn new(vendor_code: &str, vendor: ModelVendor, display_name: &str) -> Self {
        Self {
            vendor_code: vendor_code.to_owned(),
            vendor,
            display_name: display_name.to_owned(),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AiModel {
    pub catalog_key: String,
    pub model: String,
    pub display_name: String,
    pub vendor_code: String,
    pub region_code: String,
    pub capabilities: Vec<String>,
    pub description: Option<String>,
    pub modalities: Vec<String>,
    pub input_modalities: Vec<String>,
    pub output_modalities: Vec<String>,
    pub api_format: Option<String>,
    pub capability_intro: Option<String>,
    pub limitations: Vec<String>,
    pub supported_languages: Vec<String>,
    pub use_cases: Vec<String>,
    pub training_data_cutoff: Option<String>,
    pub context_tokens: Option<i64>,
    pub max_output_tokens: Option<i64>,
    pub supports_streaming: bool,
    pub supports_tools: bool,
    pub supports_json_schema: bool,
    pub release_stage: Option<i32>,
    pub shelf_state: Option<i32>,
    pub routing_state: Option<i32>,
    pub replacement_model: Option<String>,
}

impl AiModel {
    pub fn new(
        model: &str,
        display_name: &str,
        vendor_code: &str,
        capabilities: Vec<&str>,
    ) -> Self {
        Self {
            catalog_key: format!("{vendor_code}/global/{model}"),
            model: model.to_owned(),
            display_name: display_name.to_owned(),
            vendor_code: vendor_code.to_owned(),
            region_code: "global".to_owned(),
            capabilities: capabilities.into_iter().map(str::to_owned).collect(),
            description: None,
            modalities: Vec::new(),
            input_modalities: Vec::new(),
            output_modalities: Vec::new(),
            api_format: None,
            capability_intro: None,
            limitations: Vec::new(),
            supported_languages: Vec::new(),
            use_cases: Vec::new(),
            training_data_cutoff: None,
            context_tokens: None,
            max_output_tokens: None,
            supports_streaming: false,
            supports_tools: false,
            supports_json_schema: false,
            release_stage: None,
            shelf_state: None,
            routing_state: None,
            replacement_model: None,
        }
    }

    pub fn with_catalog_key(mut self, catalog_key: &str) -> Self {
        self.catalog_key = catalog_key.to_owned();
        self
    }

    pub fn with_region_code(mut self, region_code: &str) -> Self {
        self.region_code = region_code.to_owned();
        self
    }

    pub fn with_public_metadata(mut self, metadata: AiModelPublicMetadata) -> Self {
        self.description = metadata.description;
        self.modalities = metadata.modalities;
        self.input_modalities = metadata.input_modalities;
        self.output_modalities = metadata.output_modalities;
        self.api_format = metadata.api_format;
        self.capability_intro = metadata.capability_intro;
        self.limitations = metadata.limitations;
        self.supported_languages = metadata.supported_languages;
        self.use_cases = metadata.use_cases;
        self.training_data_cutoff = metadata.training_data_cutoff;
        self.context_tokens = metadata.context_tokens;
        self.max_output_tokens = metadata.max_output_tokens;
        self.supports_streaming = metadata.supports_streaming;
        self.supports_tools = metadata.supports_tools;
        self.supports_json_schema = metadata.supports_json_schema;
        self.release_stage = metadata.release_stage;
        self.shelf_state = metadata.shelf_state;
        self.routing_state = metadata.routing_state;
        self.replacement_model = metadata.replacement_model;
        self
    }
}

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct AiModelPublicMetadata {
    pub description: Option<String>,
    pub modalities: Vec<String>,
    pub input_modalities: Vec<String>,
    pub output_modalities: Vec<String>,
    pub api_format: Option<String>,
    pub capability_intro: Option<String>,
    pub limitations: Vec<String>,
    pub supported_languages: Vec<String>,
    pub use_cases: Vec<String>,
    pub training_data_cutoff: Option<String>,
    pub context_tokens: Option<i64>,
    pub max_output_tokens: Option<i64>,
    pub supports_streaming: bool,
    pub supports_tools: bool,
    pub supports_json_schema: bool,
    pub release_stage: Option<i32>,
    pub shelf_state: Option<i32>,
    pub routing_state: Option<i32>,
    pub replacement_model: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProviderRetryPolicy {
    pub max_attempts: usize,
    pub retryable_status_codes: Vec<u16>,
    pub backoff_ms: u64,
}

impl ProviderRetryPolicy {
    pub fn new(
        max_attempts: usize,
        retryable_status_codes: Vec<u16>,
        backoff_ms: u64,
    ) -> DomainResult<Self> {
        if max_attempts == 0 || max_attempts > MAX_PROVIDER_RETRY_ATTEMPTS {
            return Err(DomainError::new(format!(
                "integration_channel.retry_policy max_attempts must be between 1 and {MAX_PROVIDER_RETRY_ATTEMPTS}: {max_attempts}"
            )));
        }
        if backoff_ms > MAX_PROVIDER_RETRY_BACKOFF_MS {
            return Err(DomainError::new(format!(
                "integration_channel.retry_policy backoff_ms must be <= {MAX_PROVIDER_RETRY_BACKOFF_MS}: {backoff_ms}"
            )));
        }
        if max_attempts > 1 && retryable_status_codes.is_empty() {
            return Err(DomainError::new(
                "integration_channel.retry_policy retryable_status_codes is required when max_attempts is greater than 1",
            ));
        }

        let mut seen = BTreeSet::new();
        let mut normalized = Vec::with_capacity(retryable_status_codes.len());
        for status_code in retryable_status_codes {
            if !is_allowed_retryable_provider_status(status_code) {
                return Err(DomainError::new(format!(
                    "integration_channel.retry_policy retryable_status_codes contains unsupported status: {status_code}"
                )));
            }
            if !seen.insert(status_code) {
                return Err(DomainError::new(format!(
                    "integration_channel.retry_policy retryable_status_codes contains duplicate status: {status_code}"
                )));
            }
            normalized.push(status_code);
        }

        Ok(Self {
            max_attempts,
            retryable_status_codes: normalized,
            backoff_ms,
        })
    }

    pub fn from_json_str(value: &str) -> DomainResult<Self> {
        let value: Value = serde_json::from_str(value).map_err(|error| {
            DomainError::new(format!(
                "integration_channel.retry_policy must be valid JSON: {error}"
            ))
        })?;
        let object = value.as_object().ok_or_else(|| {
            DomainError::new("integration_channel.retry_policy must be a JSON object")
        })?;
        for key in object.keys() {
            if !matches!(
                key.as_str(),
                "max_attempts" | "retryable_status_codes" | "backoff_ms"
            ) {
                return Err(DomainError::new(format!(
                    "integration_channel.retry_policy contains unsupported field: {key}"
                )));
            }
        }

        let max_attempts = object
            .get("max_attempts")
            .and_then(Value::as_u64)
            .and_then(|value| usize::try_from(value).ok())
            .ok_or_else(|| {
                DomainError::new(
                    "integration_channel.retry_policy max_attempts must be a positive integer",
                )
            })?;
        let retryable_status_codes = object
            .get("retryable_status_codes")
            .and_then(Value::as_array)
            .ok_or_else(|| {
                DomainError::new(
                    "integration_channel.retry_policy retryable_status_codes must be an array",
                )
            })?
            .iter()
            .map(|value| {
                value
                    .as_u64()
                    .and_then(|value| u16::try_from(value).ok())
                    .ok_or_else(|| {
                        DomainError::new(
                            "integration_channel.retry_policy retryable_status_codes must contain integer HTTP statuses",
                        )
                    })
            })
            .collect::<DomainResult<Vec<_>>>()?;
        let backoff_ms = object
            .get("backoff_ms")
            .map(|value| {
                value.as_u64().ok_or_else(|| {
                    DomainError::new(
                        "integration_channel.retry_policy backoff_ms must be a non-negative integer",
                    )
                })
            })
            .transpose()?
            .unwrap_or(0);

        Self::new(max_attempts, retryable_status_codes, backoff_ms)
    }

    pub fn is_retryable_status(&self, status_code: u16) -> bool {
        self.retryable_status_codes.contains(&status_code)
    }
}

impl Default for ProviderRetryPolicy {
    fn default() -> Self {
        Self {
            max_attempts: DEFAULT_PROVIDER_RETRY_ATTEMPTS,
            retryable_status_codes: DEFAULT_RETRYABLE_PROVIDER_STATUS_CODES.to_vec(),
            backoff_ms: 0,
        }
    }
}

fn is_allowed_retryable_provider_status(status_code: u16) -> bool {
    matches!(status_code, 408 | 409 | 425 | 429 | 500 | 502 | 503 | 504)
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProviderCircuitBreakerPolicy {
    pub failure_threshold: usize,
}

impl ProviderCircuitBreakerPolicy {
    pub fn new(failure_threshold: usize) -> DomainResult<Self> {
        if failure_threshold == 0
            || failure_threshold > MAX_PROVIDER_CIRCUIT_BREAKER_FAILURE_THRESHOLD
        {
            return Err(DomainError::new(format!(
                "integration_channel.circuit_breaker_policy failure_threshold must be between 1 and {MAX_PROVIDER_CIRCUIT_BREAKER_FAILURE_THRESHOLD}: {failure_threshold}"
            )));
        }
        Ok(Self { failure_threshold })
    }

    pub fn from_json_str(value: &str) -> DomainResult<Self> {
        let value: Value = serde_json::from_str(value).map_err(|error| {
            DomainError::new(format!(
                "integration_channel.circuit_breaker_policy must be valid JSON: {error}"
            ))
        })?;
        let object = value.as_object().ok_or_else(|| {
            DomainError::new("integration_channel.circuit_breaker_policy must be a JSON object")
        })?;
        for key in object.keys() {
            if key != "failure_threshold" {
                return Err(DomainError::new(format!(
                    "integration_channel.circuit_breaker_policy contains unsupported field: {key}"
                )));
            }
        }

        let failure_threshold = object
            .get("failure_threshold")
            .and_then(Value::as_u64)
            .and_then(|value| usize::try_from(value).ok())
            .ok_or_else(|| {
                DomainError::new(
                    "integration_channel.circuit_breaker_policy failure_threshold must be a positive integer",
                )
            })?;
        Self::new(failure_threshold)
    }
}

impl Default for ProviderCircuitBreakerPolicy {
    fn default() -> Self {
        Self {
            failure_threshold: DEFAULT_PROVIDER_CIRCUIT_BREAKER_FAILURE_THRESHOLD,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProviderAuthType {
    Bearer,
    Header,
    Query,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProviderAuthHeader {
    pub name: String,
    pub value: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProviderAuthProfile {
    pub auth_type: ProviderAuthType,
    pub name: Option<String>,
    pub default_headers: Vec<ProviderAuthHeader>,
}

impl ProviderAuthProfile {
    pub fn bearer() -> Self {
        Self {
            auth_type: ProviderAuthType::Bearer,
            name: None,
            default_headers: Vec::new(),
        }
    }

    pub fn header(name: impl Into<String>) -> Self {
        Self {
            auth_type: ProviderAuthType::Header,
            name: Some(name.into()),
            default_headers: Vec::new(),
        }
    }

    pub fn query(name: impl Into<String>) -> Self {
        Self {
            auth_type: ProviderAuthType::Query,
            name: Some(name.into()),
            default_headers: Vec::new(),
        }
    }

    pub fn from_account_config(
        provider_code: &str,
        auth_type: Option<&str>,
        auth_config_json: Option<&str>,
    ) -> DomainResult<Self> {
        let config = parse_auth_config(auth_config_json)?;
        let explicit_type = auth_config_string(&config, &["type", "authType", "auth_type"])
            .or_else(|| auth_config_nested_string(&config, "auth", &["type", "authType"]))
            .or_else(|| auth_type.map(str::to_owned));
        let name = auth_config_string(
            &config,
            &[
                "name",
                "authName",
                "auth_name",
                "headerName",
                "header_name",
                "queryName",
                "query_name",
            ],
        )
        .or_else(|| {
            auth_config_nested_string(
                &config,
                "auth",
                &[
                    "name",
                    "authName",
                    "auth_name",
                    "headerName",
                    "header_name",
                    "queryName",
                    "query_name",
                ],
            )
        });
        let default_headers = parse_auth_default_headers(&config)?;

        let mut profile = match explicit_type
            .as_deref()
            .map(normalize_auth_type_code)
            .as_deref()
        {
            Some("query") => Self::query(
                name.or_else(|| default_query_auth_name(provider_code))
                    .ok_or_else(|| {
                        DomainError::new(
                            "integration_provider_account.auth_config query auth name is required",
                        )
                    })?,
            ),
            Some("header") => Self::header(
                name.or_else(|| default_header_auth_name(provider_code))
                    .ok_or_else(|| {
                        DomainError::new(
                            "integration_provider_account.auth_config header auth name is required",
                        )
                    })?,
            ),
            Some("azure_openai") => Self::header(name.unwrap_or_else(|| "api-key".to_owned())),
            Some("gcp_vertex_oauth") => Self::bearer(),
            Some("aws_bedrock") => Self::bearer(),
            Some("claude_code") => Self::bearer(),
            Some("bearer") => Self::bearer(),
            Some("standard_api_key" | "api_key" | "1" | "") | None => {
                provider_default_auth_profile(provider_code, name)
            }
            Some(value) => {
                return Err(DomainError::new(format!(
                    "integration_provider_account.auth_type contains unsupported value: {value}"
                )));
            }
        };
        validate_auth_profile(&profile)?;
        profile.default_headers = default_headers;
        validate_auth_profile(&profile)?;
        Ok(profile)
    }
}

impl Default for ProviderAuthProfile {
    fn default() -> Self {
        Self::bearer()
    }
}

fn parse_auth_config(auth_config_json: Option<&str>) -> DomainResult<Value> {
    match auth_config_json
        .map(str::trim)
        .filter(|value| !value.is_empty())
    {
        Some(value) => serde_json::from_str(value).map_err(|error| {
            DomainError::new(format!(
                "integration_provider_account.auth_config must be valid JSON: {error}"
            ))
        }),
        None => Ok(Value::Object(Default::default())),
    }
}

fn auth_config_string(config: &Value, names: &[&str]) -> Option<String> {
    names.iter().find_map(|name| {
        config
            .get(*name)
            .and_then(Value::as_str)
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(str::to_owned)
    })
}

fn auth_config_nested_string(config: &Value, object_name: &str, names: &[&str]) -> Option<String> {
    config
        .get(object_name)
        .and_then(Value::as_object)
        .and_then(|object| {
            names.iter().find_map(|name| {
                object
                    .get(*name)
                    .and_then(Value::as_str)
                    .map(str::trim)
                    .filter(|value| !value.is_empty())
                    .map(str::to_owned)
            })
        })
}

fn parse_auth_default_headers(config: &Value) -> DomainResult<Vec<ProviderAuthHeader>> {
    let Some(default_headers) = config
        .get("defaultHeaders")
        .or_else(|| config.get("default_headers"))
    else {
        return Ok(Vec::new());
    };
    let object = default_headers.as_object().ok_or_else(|| {
        DomainError::new(
            "integration_provider_account.auth_config defaultHeaders must be an object",
        )
    })?;
    let mut headers = Vec::with_capacity(object.len());
    for (name, value) in object {
        let value = value.as_str().ok_or_else(|| {
            DomainError::new(format!(
                "integration_provider_account.auth_config defaultHeaders.{name} must be a string"
            ))
        })?;
        let name = validate_provider_auth_header_name(name.trim(), "defaultHeaders header name")?;
        let value = value.trim();
        validate_provider_auth_header_value(&name, value, "defaultHeaders")?;
        headers.push(ProviderAuthHeader {
            name,
            value: value.to_owned(),
        });
    }
    headers.sort_by(|left, right| left.name.cmp(&right.name));
    Ok(headers)
}

fn validate_auth_profile(profile: &ProviderAuthProfile) -> DomainResult<()> {
    if matches!(
        profile.auth_type,
        ProviderAuthType::Header | ProviderAuthType::Query
    ) {
        let name = profile.name.as_deref().ok_or_else(|| {
            DomainError::new("integration_provider_account.auth_config auth name is required")
        })?;
        if profile.auth_type == ProviderAuthType::Header {
            validate_provider_auth_header_name(name, "auth header name")?;
        } else if name.trim().is_empty() {
            return Err(DomainError::new(
                "integration_provider_account.auth_config query auth name must not be blank",
            ));
        }
    }
    Ok(())
}

fn validate_provider_auth_header_name(name: &str, label: &str) -> DomainResult<String> {
    let name = name.trim().to_ascii_lowercase();
    if name.is_empty() {
        return Err(DomainError::new(format!(
            "integration_provider_account.auth_config {label} must not be blank"
        )));
    }
    if !name.bytes().all(is_valid_http_header_name_byte) {
        return Err(DomainError::new(format!(
            "integration_provider_account.auth_config {label} is invalid: {name}"
        )));
    }
    Ok(name)
}

fn validate_provider_auth_header_value(name: &str, value: &str, label: &str) -> DomainResult<()> {
    if value.is_empty() {
        return Err(DomainError::new(format!(
            "integration_provider_account.auth_config {label}.{name} must not be blank"
        )));
    }
    if value.bytes().any(|byte| matches!(byte, 0..=31 | 127)) {
        return Err(DomainError::new(format!(
            "integration_provider_account.auth_config {label}.{name} contains an invalid header value"
        )));
    }
    Ok(())
}

fn is_valid_http_header_name_byte(byte: u8) -> bool {
    byte.is_ascii_alphanumeric()
        || matches!(
            byte,
            b'!' | b'#'
                | b'$'
                | b'%'
                | b'&'
                | b'\''
                | b'*'
                | b'+'
                | b'-'
                | b'.'
                | b'^'
                | b'_'
                | b'`'
                | b'|'
                | b'~'
        )
}

fn normalize_auth_type_code(value: &str) -> String {
    let value = value.trim().to_ascii_lowercase();
    match value.as_str() {
        "2" => "gcp_vertex_oauth".to_owned(),
        "3" => "aws_bedrock".to_owned(),
        "4" => "azure_openai".to_owned(),
        "5" => "claude_code".to_owned(),
        "bearer" | "authorization_bearer" | "oauth_bearer" => "bearer".to_owned(),
        "header" | "api-key-header" | "api_key_header" => "header".to_owned(),
        "query" | "api-key-query" | "api_key_query" => "query".to_owned(),
        "azure openai" | "azure_openai" => "azure_openai".to_owned(),
        "gcp vertex oauth" | "gcp_vertex_oauth" => "gcp_vertex_oauth".to_owned(),
        "aws bedrock" | "aws_bedrock" | "sigv4" => "aws_bedrock".to_owned(),
        "claude code" | "claude_code" => "claude_code".to_owned(),
        "standard api key" | "standard_api_key" | "api key" | "api_key" | "1" | "" => {
            "standard_api_key".to_owned()
        }
        _ => value.replace(' ', "_"),
    }
}

fn provider_default_auth_profile(
    provider_code: &str,
    configured_name: Option<String>,
) -> ProviderAuthProfile {
    let provider_code = provider_code.trim().to_ascii_lowercase();
    match provider_code.as_str() {
        "google" | "gemini" | "google_gemini" => ProviderAuthProfile::header(
            configured_name.unwrap_or_else(|| "x-goog-api-key".to_owned()),
        ),
        "anthropic" | "claude" => {
            ProviderAuthProfile::header(configured_name.unwrap_or_else(|| "x-api-key".to_owned()))
        }
        "azure" | "azure_openai" => {
            ProviderAuthProfile::header(configured_name.unwrap_or_else(|| "api-key".to_owned()))
        }
        _ => configured_name
            .map(ProviderAuthProfile::header)
            .unwrap_or_else(ProviderAuthProfile::bearer),
    }
}

fn default_header_auth_name(provider_code: &str) -> Option<String> {
    match provider_code.trim().to_ascii_lowercase().as_str() {
        "google" | "gemini" | "google_gemini" => Some("x-goog-api-key".to_owned()),
        "anthropic" | "claude" => Some("x-api-key".to_owned()),
        "azure" | "azure_openai" => Some("api-key".to_owned()),
        _ => Some("x-api-key".to_owned()),
    }
}

fn default_query_auth_name(provider_code: &str) -> Option<String> {
    match provider_code.trim().to_ascii_lowercase().as_str() {
        "google" | "gemini" | "google_gemini" => Some("key".to_owned()),
        _ => Some("api_key".to_owned()),
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ModelProviderRoute {
    pub catalog_key: String,
    pub model: String,
    pub provider_code: String,
    pub channel_id: i64,
    pub provider_model: String,
    pub base_url: Option<String>,
    pub secret_ref: Option<String>,
    pub auth_profile: ProviderAuthProfile,
    pub timeout_ms: Option<u64>,
    pub retry_policy: Option<ProviderRetryPolicy>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProviderAccountPoolRoute {
    pub provider_code: String,
    pub channel_id: i64,
    pub base_url: Option<String>,
    pub secret_ref: Option<String>,
    pub auth_profile: ProviderAuthProfile,
    pub timeout_ms: Option<u64>,
    pub retry_policy: Option<ProviderRetryPolicy>,
}

impl ProviderAccountPoolRoute {
    pub fn new(provider_code: &str, channel_id: i64) -> Self {
        Self {
            provider_code: provider_code.to_owned(),
            channel_id,
            base_url: None,
            secret_ref: None,
            auth_profile: ProviderAuthProfile::default(),
            timeout_ms: None,
            retry_policy: None,
        }
    }

    pub fn with_provider_endpoint(
        mut self,
        base_url: Option<impl Into<String>>,
        secret_ref: Option<impl Into<String>>,
    ) -> Self {
        self.base_url = base_url.map(Into::into);
        self.secret_ref = secret_ref.map(Into::into);
        self
    }

    pub fn with_auth_profile(mut self, auth_profile: ProviderAuthProfile) -> Self {
        self.auth_profile = auth_profile;
        self
    }

    pub fn with_timeout_ms(mut self, timeout_ms: u64) -> Self {
        self.timeout_ms = Some(timeout_ms);
        self
    }

    pub fn with_retry_policy(mut self, retry_policy: ProviderRetryPolicy) -> Self {
        self.retry_policy = Some(retry_policy);
        self
    }
}

impl ModelProviderRoute {
    pub fn new(model: &str, provider_code: &str, channel_id: i64, provider_model: &str) -> Self {
        Self {
            catalog_key: model.to_owned(),
            model: model.to_owned(),
            provider_code: provider_code.to_owned(),
            channel_id,
            provider_model: provider_model.to_owned(),
            base_url: None,
            secret_ref: None,
            auth_profile: ProviderAuthProfile::default(),
            timeout_ms: None,
            retry_policy: None,
        }
    }

    pub fn new_for_catalog_key(
        catalog_key: &str,
        model: &str,
        provider_code: &str,
        channel_id: i64,
        provider_model: &str,
    ) -> Self {
        Self {
            catalog_key: catalog_key.to_owned(),
            model: model.to_owned(),
            provider_code: provider_code.to_owned(),
            channel_id,
            provider_model: provider_model.to_owned(),
            base_url: None,
            secret_ref: None,
            auth_profile: ProviderAuthProfile::default(),
            timeout_ms: None,
            retry_policy: None,
        }
    }

    pub fn with_catalog_key(mut self, catalog_key: &str) -> Self {
        self.catalog_key = catalog_key.to_owned();
        self
    }

    pub fn with_provider_endpoint(
        mut self,
        base_url: Option<impl Into<String>>,
        secret_ref: Option<impl Into<String>>,
    ) -> Self {
        self.base_url = base_url.map(Into::into);
        self.secret_ref = secret_ref.map(Into::into);
        self
    }

    pub fn with_auth_profile(mut self, auth_profile: ProviderAuthProfile) -> Self {
        self.auth_profile = auth_profile;
        self
    }

    pub fn with_timeout_ms(mut self, timeout_ms: u64) -> Self {
        self.timeout_ms = Some(timeout_ms);
        self
    }

    pub fn with_retry_policy(mut self, retry_policy: ProviderRetryPolicy) -> Self {
        self.retry_policy = Some(retry_policy);
        self
    }
}
