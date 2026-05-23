use serde::{Deserialize, Serialize};

use crate::models::{AgentRunStepResponse};

/// Agent run steps create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunStepsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on agent run steps create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AgentRunStepResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
