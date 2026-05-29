use serde::{Deserialize, Serialize};

/// Persisted channel regional endpoint snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminChannelEndpointItem {
    /// Api endpoint code field on admin channel endpoint item.
    #[serde(rename = "apiEndpointCode")]
    pub api_endpoint_code: String,

    /// Base url field on admin channel endpoint item.
    #[serde(rename = "baseUrl")]
    pub base_url: String,

    /// Channel code field on admin channel endpoint item.
    #[serde(rename = "channelCode")]
    pub channel_code: String,

    /// Channel id field on admin channel endpoint item.
    #[serde(rename = "channelId")]
    pub channel_id: String,

    /// Channel type field on admin channel endpoint item.
    #[serde(rename = "channelType")]
    pub channel_type: String,

    /// Effective from field on admin channel endpoint item.
    #[serde(rename = "effectiveFrom")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on admin channel endpoint item.
    #[serde(rename = "effectiveTo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Health status field on admin channel endpoint item.
    #[serde(rename = "healthStatus")]
    pub health_status: String,

    /// Id field on admin channel endpoint item.
    pub id: String,

    /// Priority field on admin channel endpoint item.
    pub priority: i64,

    /// Provider code field on admin channel endpoint item.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Region code field on admin channel endpoint item.
    #[serde(rename = "regionCode")]
    pub region_code: String,

    /// Status field on admin channel endpoint item.
    pub status: String,

    /// Vendor code field on admin channel endpoint item.
    #[serde(rename = "vendorCode")]
    pub vendor_code: String,

    /// Weight field on admin channel endpoint item.
    pub weight: i64,
}
