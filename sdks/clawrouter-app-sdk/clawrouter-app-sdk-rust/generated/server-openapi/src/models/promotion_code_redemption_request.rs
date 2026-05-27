use serde::{Deserialize, Serialize};

/// Promotion code redemption request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionCodeRedemptionRequest {
    /// Client request no field on promotion code redemption request.
    #[serde(rename = "clientRequestNo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_request_no: Option<String>,

    /// Code field on promotion code redemption request.
    pub code: String,

    /// Note field on promotion code redemption request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub note: Option<String>,

    /// Scene field on promotion code redemption request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scene: Option<String>,

    /// Source field on promotion code redemption request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
}
