use serde::{Deserialize, Serialize};

use crate::models::{ProviderCircuitBreakerPolicy, ProviderRetryPolicy};

/// Admin channel create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminChannelCreateRequest {
    /// Access type field on admin channel create request.
    #[serde(rename = "accessType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub access_type: Option<String>,

    /// Plaintext provider API key accepted only on create/update input. Backend encrypts it into ai_channel.auth_config and never returns it.
    #[serde(rename = "apiKey")]
    pub api_key: String,

    /// Base url field on admin channel create request.
    #[serde(rename = "baseUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Capabilities field on admin channel create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<Vec<String>>,

    /// Channel type. official means a direct vendor account; relay means an upstream aggregator account that can expose multiple vendors.
    #[serde(rename = "channelType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_type: Option<String>,

    /// Circuit breaker policy field on admin channel create request.
    #[serde(rename = "circuitBreakerPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub circuit_breaker_policy: Option<ProviderCircuitBreakerPolicy>,

    /// Expires at field on admin channel create request.
    #[serde(rename = "expiresAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Models field on admin channel create request.
    pub models: Vec<String>,

    /// Name field on admin channel create request.
    pub name: String,

    /// Protocol field on admin channel create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub protocol: Option<String>,

    /// Resource bindings selected from ai_resource or ai_resource_group, such as vendor.openai, api.openai.chat_completions, model.openai.gpt-4o-mini.chat, or bundle.openrouter.openai.standard.
    #[serde(rename = "resourceCodes")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_codes: Option<Vec<String>>,

    /// Retry policy field on admin channel create request.
    #[serde(rename = "retryPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_policy: Option<ProviderRetryPolicy>,

    /// Optional compatibility path for existing Vault/KMS secret references. New admin UI submits apiKey instead.
    #[serde(rename = "secretRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Status field on admin channel create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Per-channel upstream response timeout in milliseconds.
    #[serde(rename = "timeoutMs")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub timeout_ms: Option<i64>,

    /// Vendor field on admin channel create request.
    pub vendor: String,

    /// Weight field on admin channel create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}
