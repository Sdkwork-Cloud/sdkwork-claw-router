use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillCategoryDeleteResponse};

/// Skills categories delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsCategoriesDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills categories delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSkillCategoryDeleteResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
