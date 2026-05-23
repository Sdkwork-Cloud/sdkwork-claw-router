use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductCategoryItem};

/// Commerce product category list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductCategoryListResponse {
    /// Items field on commerce product category list response.
    pub items: Vec<CommerceProductCategoryItem>,

    /// Page field on commerce product category list response.
    pub page: i64,

    /// Page size field on commerce product category list response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on commerce product category list response.
    pub total: i64,
}
