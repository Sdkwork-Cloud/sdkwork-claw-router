use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillMutationResponse};

/// Skills update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSkillMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
