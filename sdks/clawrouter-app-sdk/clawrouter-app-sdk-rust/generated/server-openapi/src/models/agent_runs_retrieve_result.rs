use serde::{Deserialize, Serialize};

use crate::models::{AgentRunItem};

/// Agent runs retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on agent runs retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AgentRunItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
