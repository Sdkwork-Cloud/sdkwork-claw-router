use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillCategoryItem};

/// Admin skill category list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillCategoryListResponse {
    /// Skill category snapshots returned by the backend.
    pub items: Vec<AdminSkillCategoryItem>,
}
