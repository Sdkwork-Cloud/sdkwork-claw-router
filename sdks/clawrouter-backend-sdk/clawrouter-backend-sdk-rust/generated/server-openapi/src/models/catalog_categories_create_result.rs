use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductCategoryMutationResponse};

/// Catalog categories create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogCategoriesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog categories create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceProductCategoryMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
