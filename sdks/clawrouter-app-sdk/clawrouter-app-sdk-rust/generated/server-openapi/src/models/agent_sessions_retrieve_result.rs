use serde::{Deserialize, Serialize};

use crate::models::{AgentSessionItem};

/// Agent sessions retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentSessionsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on agent sessions retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AgentSessionItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
