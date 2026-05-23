use serde::{Deserialize, Serialize};

use crate::models::{AdminAppCategoryListResponse};

/// Apps categories list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppsCategoriesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on apps categories list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAppCategoryListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
