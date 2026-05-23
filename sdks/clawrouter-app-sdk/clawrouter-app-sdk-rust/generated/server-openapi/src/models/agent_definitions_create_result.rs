use serde::{Deserialize, Serialize};

use crate::models::{AgentItemResponse};

/// Agent definitions create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentDefinitionsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on agent definitions create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AgentItemResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
