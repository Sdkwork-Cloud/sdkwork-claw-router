use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillPackageMutationResponse};

/// Skills package update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsPackageUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills package update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSkillPackageMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
