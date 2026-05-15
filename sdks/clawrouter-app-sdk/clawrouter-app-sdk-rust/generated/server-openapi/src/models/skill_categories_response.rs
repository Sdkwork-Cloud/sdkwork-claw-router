use serde::{Deserialize, Serialize};

/// Skill categories response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillCategoriesResponse {
    /// Items field on skill categories response.
    pub items: Vec<String>,
}
