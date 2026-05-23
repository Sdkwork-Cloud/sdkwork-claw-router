use serde::{Deserialize, Serialize};

use crate::models::{AdminAppCategoryMutationResponse};

/// Apps categories create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppsCategoriesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on apps categories create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAppCategoryMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
