use serde::{Deserialize, Serialize};

use crate::models::{SkillCategoriesResponse};

/// Skills categories list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsCategoriesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills categories list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<SkillCategoriesResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
