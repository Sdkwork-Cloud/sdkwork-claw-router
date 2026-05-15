use serde::{Deserialize, Serialize};

use crate::models::{AdminCouponsResponse};

/// Coupons list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CouponsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on coupons list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCouponsResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
