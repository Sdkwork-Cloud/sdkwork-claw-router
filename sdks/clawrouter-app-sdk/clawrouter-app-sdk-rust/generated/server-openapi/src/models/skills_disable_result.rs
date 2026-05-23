use serde::{Deserialize, Serialize};

use crate::models::{AppInstalledSkillResponse};

/// Skills disable result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsDisableResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills disable result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AppInstalledSkillResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
