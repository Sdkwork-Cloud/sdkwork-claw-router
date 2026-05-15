use serde::{Deserialize, Serialize};

/// Admin access group update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAccessGroupUpdateRequest {
    /// Billing contract attached to the access group.
    #[serde(rename = "billingType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_type: Option<String>,

    /// Capacity field on admin access group update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capacity: Option<serde_json::Value>,

    /// Access group display name.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Normalized upstream platform code.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub platform: Option<String>,

    /// Customer rate multiplier rounded to six decimals.
    #[serde(rename = "rateMultiplier")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rate_multiplier: Option<f64>,

    /// Status field on admin access group update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Access group allocation mode.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub r#type: Option<String>,
}
