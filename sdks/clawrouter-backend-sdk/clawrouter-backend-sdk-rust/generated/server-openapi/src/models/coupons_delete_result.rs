use serde::{Deserialize, Serialize};

use crate::models::{AdminDeleteResponse};

/// Coupons delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CouponsDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on coupons delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminDeleteResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
