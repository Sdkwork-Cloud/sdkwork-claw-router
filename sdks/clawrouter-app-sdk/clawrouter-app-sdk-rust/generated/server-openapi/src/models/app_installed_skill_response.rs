use serde::{Deserialize, Serialize};

use crate::models::{AppInstalledSkillItem};

/// App installed skill response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppInstalledSkillResponse {
    /// Item field on app installed skill response.
    pub item: AppInstalledSkillItem,
}
