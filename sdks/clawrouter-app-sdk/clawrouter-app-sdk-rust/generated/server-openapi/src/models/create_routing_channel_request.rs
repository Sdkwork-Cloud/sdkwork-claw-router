use serde::{Deserialize, Serialize};

use crate::models::{ProviderCircuitBreakerPolicy, ProviderRetryPolicy};

/// Create routing channel request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CreateRoutingChannelRequest {
    /// Access type field on create routing channel request.
    #[serde(rename = "accessType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub access_type: Option<String>,

    /// Base url field on create routing channel request.
    #[serde(rename = "baseUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Capabilities field on create routing channel request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<Vec<String>>,

    /// Circuit breaker policy field on create routing channel request.
    #[serde(rename = "circuitBreakerPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub circuit_breaker_policy: Option<ProviderCircuitBreakerPolicy>,

    /// Models field on create routing channel request.
    pub models: Vec<String>,

    /// Name field on create routing channel request.
    pub name: String,

    /// Protocol field on create routing channel request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub protocol: Option<String>,

    /// Retry policy field on create routing channel request.
    #[serde(rename = "retryPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_policy: Option<ProviderRetryPolicy>,

    /// Vault/KMS secret reference. Plaintext credential fields are forbidden.
    #[serde(rename = "secretRef")]
    pub secret_ref: String,

    /// Status field on create routing channel request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Per-channel upstream response timeout in milliseconds.
    #[serde(rename = "timeoutMs")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub timeout_ms: Option<i64>,

    /// Vendor field on create routing channel request.
    pub vendor: String,

    /// Weight field on create routing channel request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}
