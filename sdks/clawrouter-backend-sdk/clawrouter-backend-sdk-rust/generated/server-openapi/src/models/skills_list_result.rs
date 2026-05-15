use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillListResponse};

/// Skills list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSkillListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
