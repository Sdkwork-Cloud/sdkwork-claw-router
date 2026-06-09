use serde::{Deserialize, Serialize};

use crate::models::{IamPositionAssignmentListResponse};

/// Position assignments list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PositionAssignmentsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on position assignments list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<IamPositionAssignmentListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
