use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillPackageDeleteResponse};

/// Skills package delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsPackageDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills package delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSkillPackageDeleteResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
