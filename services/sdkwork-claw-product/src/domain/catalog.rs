use std::collections::BTreeSet;

use serde_json::Value;

use crate::domain::{DomainError, DomainResult, ModelVendor};

const DEFAULT_PROVIDER_RETRY_ATTEMPTS: usize = 2;
const MAX_PROVIDER_RETRY_ATTEMPTS: usize = 5;
const MAX_PROVIDER_RETRY_BACKOFF_MS: u64 = 2_000;
const DEFAULT_RETRYABLE_PROVIDER_STATUS_CODES: [u16; 5] = [429, 500, 502, 503, 504];

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
pub struct ModelProviderRoute {
    pub catalog_key: String,
    pub model: String,
    pub provider_code: String,
    pub channel_id: i64,
    pub provider_model: String,
    pub base_url: Option<String>,
    pub secret_ref: Option<String>,
    pub timeout_ms: Option<u64>,
    pub retry_policy: Option<ProviderRetryPolicy>,
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

    pub fn with_timeout_ms(mut self, timeout_ms: u64) -> Self {
        self.timeout_ms = Some(timeout_ms);
        self
    }

    pub fn with_retry_policy(mut self, retry_policy: ProviderRetryPolicy) -> Self {
        self.retry_policy = Some(retry_policy);
        self
    }
}
