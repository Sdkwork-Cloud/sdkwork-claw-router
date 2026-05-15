use serde::{Deserialize, Serialize};

use crate::models::{AdminCouponMutationResponse};

/// Coupons create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CouponsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on coupons create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCouponMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
