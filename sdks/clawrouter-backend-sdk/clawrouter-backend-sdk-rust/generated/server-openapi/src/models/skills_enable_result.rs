use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillMutationResponse};

/// Skills enable result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsEnableResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills enable result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSkillMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
