use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillArtifactMutationResponse};

/// Skills artifacts update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsArtifactsUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills artifacts update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSkillArtifactMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
