use serde::{Deserialize, Serialize};

/// Routing channel item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingChannelItem {
    /// Access type field on routing channel item.
    #[serde(rename = "accessType")]
    pub access_type: String,

    /// Api key field on routing channel item.
    #[serde(rename = "apiKey")]
    pub api_key: String,

    /// Balance field on routing channel item.
    pub balance: String,

    /// Base url field on routing channel item.
    #[serde(rename = "baseUrl")]
    pub base_url: String,

    /// Capabilities field on routing channel item.
    pub capabilities: Vec<String>,

    /// Errors field on routing channel item.
    pub errors: i64,

    /// Id field on routing channel item.
    pub id: String,

    /// Is multimodal field on routing channel item.
    #[serde(rename = "isMultimodal")]
    pub is_multimodal: bool,

    /// Latency field on routing channel item.
    pub latency: String,

    /// Models field on routing channel item.
    pub models: Vec<String>,

    /// Name field on routing channel item.
    pub name: String,

    /// Protocol field on routing channel item.
    pub protocol: String,

    /// Provider field on routing channel item.
    pub provider: String,

    /// Provider code field on routing channel item.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Rpm field on routing channel item.
    pub rpm: i64,

    /// Status field on routing channel item.
    pub status: String,

    /// Vendor field on routing channel item.
    pub vendor: String,

    /// Weight field on routing channel item.
    pub weight: i64,
}
