use serde::{Deserialize, Serialize};

use crate::models::{ProviderRetryPolicy};

/// Persisted channel snapshot returned after the provider health probe. Secret refs and tokens are not returned.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminChannelItem {
    /// Access type field on admin channel item.
    #[serde(rename = "accessType")]
    pub access_type: String,

    /// Balance field on admin channel item.
    pub balance: String,

    /// Base url field on admin channel item.
    #[serde(rename = "baseUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Capabilities field on admin channel item.
    pub capabilities: Vec<String>,

    /// Errors field on admin channel item.
    pub errors: i64,

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
