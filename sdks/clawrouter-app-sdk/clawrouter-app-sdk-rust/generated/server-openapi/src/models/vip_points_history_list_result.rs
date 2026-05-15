use serde::{Deserialize, Serialize};

use crate::models::{CommercePointsHistoryItem};

/// Vip points history list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct VipPointsHistoryListResult {
    /// Business response code.
    pub code: String,

    /// Data field on vip points history list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<Vec<CommercePointsHistoryItem>>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
