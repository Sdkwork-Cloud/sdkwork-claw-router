use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSkuItem};

/// Commerce product sku list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSkuListResponse {
    /// Items field on commerce product sku list response.
    pub items: Vec<CommerceProductSkuItem>,

    /// Page field on commerce product sku list response.
    pub page: i64,

    /// Page size field on commerce product sku list response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on commerce product sku list response.
    pub total: i64,
}
