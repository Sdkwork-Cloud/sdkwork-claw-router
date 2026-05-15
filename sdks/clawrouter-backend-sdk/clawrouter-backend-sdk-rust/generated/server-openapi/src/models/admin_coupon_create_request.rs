use serde::{Deserialize, Serialize};

/// Admin coupon create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCouponCreateRequest {
    /// Human-readable coupon name.
    pub name: String,

    /// Optional coupon availability state.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Coupon value mode accepted by the backend.
    pub r#type: String,

    /// Positive money amount or discount percentage depending on coupon type.
    pub value: String,
}
