use serde::{Deserialize, Serialize};

use crate::models::{IamPositionListResponse};

/// Positions list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PositionsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on positions list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<IamPositionListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
