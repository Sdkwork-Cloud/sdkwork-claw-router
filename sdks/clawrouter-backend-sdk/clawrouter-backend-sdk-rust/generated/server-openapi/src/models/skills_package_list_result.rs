use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillPackageListResponse};

/// Skills package list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsPackageListResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills package list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSkillPackageListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
