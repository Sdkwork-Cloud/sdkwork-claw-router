use serde::{Deserialize, Serialize};

use crate::models::{AppInstalledSkillsResponse};

/// Users current skills list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UsersCurrentSkillsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on users current skills list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AppInstalledSkillsResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
