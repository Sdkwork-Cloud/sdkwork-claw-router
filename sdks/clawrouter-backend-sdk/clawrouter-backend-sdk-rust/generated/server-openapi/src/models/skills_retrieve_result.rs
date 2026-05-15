use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillMutationResponse};

/// Skills retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSkillMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
