use serde::{Deserialize, Serialize};

/// Admin channel endpoint create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminChannelEndpointCreateRequest {
    /// Api endpoint code field on admin channel endpoint create request.
    #[serde(rename = "apiEndpointCode")]
    pub api_endpoint_code: String,

    /// Base url field on admin channel endpoint create request.
    #[serde(rename = "baseUrl")]
    pub base_url: String,

    /// Scoped ai_channel id. Provider and channel identity are derived by the backend and are never trusted from request input.
    #[serde(rename = "channelId")]
    pub channel_id: String,

    /// Effective from field on admin channel endpoint create request.
    #[serde(rename = "effectiveFrom")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on admin channel endpoint create request.
    #[serde(rename = "effectiveTo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Priority field on admin channel endpoint create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Region code field on admin channel endpoint create request.
    #[serde(rename = "regionCode")]
    pub region_code: String,

    /// Status field on admin channel endpoint create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Vendor code field on admin channel endpoint create request.
    #[serde(rename = "vendorCode")]
    pub vendor_code: String,

    /// Weight field on admin channel endpoint create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}
