use serde::{Deserialize, Serialize};

/// Admin skill delete response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillDeleteResponse {
    /// Whether the agent skill was deleted.
    pub deleted: bool,
}
