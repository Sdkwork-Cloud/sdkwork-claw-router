use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductCategoryListResponse};

/// Catalog categories list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogCategoriesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog categories list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceProductCategoryListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
