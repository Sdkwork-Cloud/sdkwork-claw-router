use serde::{Deserialize, Serialize};

use crate::models::{AppInstalledSkillItem};

/// App installed skills response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppInstalledSkillsResponse {
    /// Items field on app installed skills response.
    pub items: Vec<AppInstalledSkillItem>,
}
