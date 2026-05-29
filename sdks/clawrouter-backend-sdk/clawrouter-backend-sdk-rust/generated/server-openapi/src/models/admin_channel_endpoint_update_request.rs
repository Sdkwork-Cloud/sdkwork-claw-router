use serde::{Deserialize, Serialize};

/// Admin channel endpoint update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminChannelEndpointUpdateRequest {
    /// Api endpoint code field on admin channel endpoint update request.
    #[serde(rename = "apiEndpointCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_endpoint_code: Option<String>,

    /// Base url field on admin channel endpoint update request.
    #[serde(rename = "baseUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Effective from field on admin channel endpoint update request.
    #[serde(rename = "effectiveFrom")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on admin channel endpoint update request.
    #[serde(rename = "effectiveTo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Priority field on admin channel endpoint update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Region code field on admin channel endpoint update request.
    #[serde(rename = "regionCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region_code: Option<String>,

    /// Status field on admin channel endpoint update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Vendor code field on admin channel endpoint update request.
    #[serde(rename = "vendorCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,

    /// Weight field on admin channel endpoint update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}
