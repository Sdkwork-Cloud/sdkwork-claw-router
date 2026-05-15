use serde::{Deserialize, Serialize};

use crate::models::{CommercePointsBalanceResponse};

/// Vip points balance retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct VipPointsBalanceRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on vip points balance retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePointsBalanceResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
