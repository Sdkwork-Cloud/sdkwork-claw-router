use serde::{Deserialize, Serialize};

/// Admin skill asset delete response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillAssetDeleteResponse {
    /// Whether the skill catalog asset was deleted.
    pub deleted: bool,
}
