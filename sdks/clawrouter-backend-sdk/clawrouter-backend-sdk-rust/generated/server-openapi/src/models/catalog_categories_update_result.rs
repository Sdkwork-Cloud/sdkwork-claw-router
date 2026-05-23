use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductCategoryMutationResponse};

/// Catalog categories update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogCategoriesUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog categories update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceProductCategoryMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
