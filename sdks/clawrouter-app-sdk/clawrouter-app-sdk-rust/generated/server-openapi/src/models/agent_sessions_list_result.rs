use serde::{Deserialize, Serialize};

use crate::models::{AgentSessionListResponse};

/// Agent sessions list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentSessionsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on agent sessions list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AgentSessionListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
