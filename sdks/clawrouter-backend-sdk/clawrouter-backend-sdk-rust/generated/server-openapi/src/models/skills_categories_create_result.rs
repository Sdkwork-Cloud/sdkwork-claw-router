use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillCategoryMutationResponse};

/// Skills categories create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsCategoriesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills categories create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSkillCategoryMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
