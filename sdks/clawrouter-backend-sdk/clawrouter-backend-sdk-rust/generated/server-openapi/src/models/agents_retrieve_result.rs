use serde::{Deserialize, Serialize};

use crate::models::{AdminAgentItem};

/// Agents retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on agents retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAgentItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
