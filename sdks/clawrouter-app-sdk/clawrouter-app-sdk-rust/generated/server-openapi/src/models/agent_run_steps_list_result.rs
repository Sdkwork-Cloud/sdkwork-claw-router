use serde::{Deserialize, Serialize};

use crate::models::{AgentRunStepListResponse};

/// Agent run steps list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunStepsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on agent run steps list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AgentRunStepListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
