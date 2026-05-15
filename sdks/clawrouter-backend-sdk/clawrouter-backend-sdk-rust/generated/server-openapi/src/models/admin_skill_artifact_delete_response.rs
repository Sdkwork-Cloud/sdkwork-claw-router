use serde::{Deserialize, Serialize};

/// Admin skill artifact delete response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillArtifactDeleteResponse {
    /// Whether the skill catalog artifact was deleted.
    pub deleted: bool,
}
