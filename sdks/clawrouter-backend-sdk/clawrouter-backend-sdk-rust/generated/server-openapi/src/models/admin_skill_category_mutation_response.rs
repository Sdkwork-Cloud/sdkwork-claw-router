use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillCategoryItem};

/// Admin skill category mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillCategoryMutationResponse {
    /// Item field on admin skill category mutation response.
    pub item: AdminSkillCategoryItem,
}
