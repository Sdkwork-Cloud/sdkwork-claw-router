use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillAssetItem};

/// Admin skill asset list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillAssetListResponse {
    /// Skill catalog assets attached to the agent skill.
    pub items: Vec<AdminSkillAssetItem>,
}
