use serde::{Deserialize, Serialize};

use crate::models::{ProviderCircuitBreakerPolicy, ProviderRetryPolicy};

/// Persisted channel snapshot returned after the provider health probe. Admin management responses may return the stored plaintext provider API key for channel account relay operations.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminChannelItem {
    /// Access type field on admin channel item.
    #[serde(rename = "accessType")]
    pub access_type: String,

    /// Full plaintext provider API key returned by authenticated admin management responses for channel account relay operations.
    #[serde(rename = "apiKey")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_key: Option<String>,

    /// Balance field on admin channel item.
    pub balance: String,

    /// Base url field on admin channel item.
    #[serde(rename = "baseUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Capabilities field on admin channel item.
    pub capabilities: Vec<String>,

    /// Circuit breaker policy field on admin channel item.
    #[serde(rename = "circuitBreakerPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub circuit_breaker_policy: Option<ProviderCircuitBreakerPolicy>,

    /// Created at field on admin channel item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Errors field on admin channel item.
    pub errors: i64,

    /// Expires at field on admin channel item.
    #[serde(rename = "expiresAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Id field on admin channel item.
    pub id: String,

    /// Is multimodal field on admin channel item.
    #[serde(rename = "isMultimodal")]
    pub is_multimodal: bool,

    /// Models field on admin channel item.
    pub models: Vec<String>,

    /// Name field on admin channel item.
    pub name: String,

    /// Protocol field on admin channel item.
    pub protocol: String,

    /// Retry policy field on admin channel item.
    #[serde(rename = "retryPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_policy: Option<ProviderRetryPolicy>,

    /// Secret ref field on admin channel item.
    #[serde(rename = "secretRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Status field on admin channel item.
    pub status: String,

    /// Timeout ms field on admin channel item.
    #[serde(rename = "timeoutMs")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub timeout_ms: Option<i64>,

    /// Vendor field on admin channel item.
    pub vendor: String,

    /// Weight field on admin channel item.
    pub weight: i64,
}
