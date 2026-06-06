use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductCategoryAttributeItem};

/// Commerce product category attribute list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductCategoryAttributeListResponse {
    /// Items field on commerce product category attribute list response.
    pub items: Vec<CommerceProductCategoryAttributeItem>,

    /// Page field on commerce product category attribute list response.
    pub page: String,

    /// Page size field on commerce product category attribute list response.
    #[serde(rename = "pageSize")]
    pub page_size: String,

    /// Total field on commerce product category attribute list response.
    pub total: String,
}
