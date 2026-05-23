use serde::{Deserialize, Serialize};

use crate::models::{AdminAppCategoryDeleteResponse};

/// Apps categories delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppsCategoriesDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on apps categories delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAppCategoryDeleteResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
