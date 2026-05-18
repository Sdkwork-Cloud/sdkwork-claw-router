use serde::{Deserialize, Serialize};

/// Admin skill category delete response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillCategoryDeleteResponse {
    /// Whether the skill category was deleted.
    pub deleted: bool,
}
