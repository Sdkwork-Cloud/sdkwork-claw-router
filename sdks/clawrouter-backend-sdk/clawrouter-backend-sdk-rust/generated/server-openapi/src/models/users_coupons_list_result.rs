use serde::{Deserialize, Serialize};

use crate::models::{AdminRedemptionRecordsResponse};

/// Users coupons list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UsersCouponsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on users coupons list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminRedemptionRecordsResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
