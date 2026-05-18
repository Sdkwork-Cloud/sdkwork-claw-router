use serde::{Deserialize, Serialize};

use crate::models::{AgentItem};

/// Agent definitions retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentDefinitionsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on agent definitions retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AgentItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
