use serde::{Deserialize, Serialize};

use crate::models::{ProviderRetryPolicy};

/// Update routing channel request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UpdateRoutingChannelRequest {
    /// Access type field on update routing channel request.
    #[serde(rename = "accessType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub access_type: Option<String>,

    /// Base url field on update routing channel request.
    #[serde(rename = "baseUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Capabilities field on update routing channel request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<Vec<String>>,

    /// Models field on update routing channel request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub models: Option<Vec<String>>,

    /// Name field on update routing channel request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Protocol field on update routing channel request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub protocol: Option<String>,

    /// Retry policy field on update routing channel request.
    #[serde(rename = "retryPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_policy: Option<ProviderRetryPolicy>,

    /// Vault/KMS secret reference. Plaintext credential fields are forbidden.
    #[serde(rename = "secretRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Status field on update routing channel request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Timeout ms field on update routing channel request.
    #[serde(rename = "timeoutMs")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub timeout_ms: Option<i64>,

    /// Vendor field on update routing channel request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor: Option<String>,

    /// Weight field on update routing channel request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}
