use serde::{Deserialize, Serialize};

use crate::models::{AdminCouponBatchesResponse};

/// Coupon batches list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CouponBatchesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on coupon batches list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCouponBatchesResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
