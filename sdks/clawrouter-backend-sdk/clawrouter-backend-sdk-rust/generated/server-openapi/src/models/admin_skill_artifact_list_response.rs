use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillArtifactItem};

/// Admin skill artifact list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillArtifactListResponse {
    /// Skill catalog artifacts attached to the agent skill.
    pub items: Vec<AdminSkillArtifactItem>,
}
