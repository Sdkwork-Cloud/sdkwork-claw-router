use serde::{Deserialize, Serialize};

use crate::models::{AdminPromoCodesResponse};

/// Coupon codes list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CouponCodesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on coupon codes list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminPromoCodesResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
