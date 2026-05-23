use serde::{Deserialize, Serialize};

use crate::models::{AgentRunListResponse};

/// Agent runs list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on agent runs list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AgentRunListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
