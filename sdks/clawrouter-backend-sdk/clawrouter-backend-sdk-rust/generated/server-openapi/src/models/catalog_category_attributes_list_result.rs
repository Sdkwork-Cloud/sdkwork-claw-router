use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductCategoryAttributeListResponse};

/// Catalog category attributes list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogCategoryAttributesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog category attributes list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceProductCategoryAttributeListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
