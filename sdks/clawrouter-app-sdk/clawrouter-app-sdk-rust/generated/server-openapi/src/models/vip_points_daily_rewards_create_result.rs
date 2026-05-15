use serde::{Deserialize, Serialize};

use crate::models::{CommerceOperationResponse};

/// Vip points daily rewards create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct VipPointsDailyRewardsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on vip points daily rewards create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
