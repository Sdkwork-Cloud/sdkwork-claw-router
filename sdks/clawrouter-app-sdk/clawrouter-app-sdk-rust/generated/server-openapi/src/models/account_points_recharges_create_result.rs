use serde::{Deserialize, Serialize};

use crate::models::{SubmitRechargeResponse};

/// Account points recharges create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountPointsRechargesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on account points recharges create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<SubmitRechargeResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
