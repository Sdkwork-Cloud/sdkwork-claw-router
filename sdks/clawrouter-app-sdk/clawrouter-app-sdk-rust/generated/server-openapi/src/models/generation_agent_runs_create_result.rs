use serde::{Deserialize, Serialize};

use crate::models::{GenerationAgentRunCreateResponse};

/// Generation agent runs create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationAgentRunsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on generation agent runs create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<GenerationAgentRunCreateResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
