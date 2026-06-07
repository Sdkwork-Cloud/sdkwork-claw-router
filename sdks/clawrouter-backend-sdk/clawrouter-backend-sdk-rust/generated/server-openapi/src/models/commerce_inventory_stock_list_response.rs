use serde::{Deserialize, Serialize};

use crate::models::{CommerceInventoryStockItem};

/// Commerce inventory stock list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryStockListResponse {
    /// Items field on commerce inventory stock list response.
    pub items: Vec<CommerceInventoryStockItem>,

    /// Page field on commerce inventory stock list response.
    pub page: String,

    /// Page size field on commerce inventory stock list response.
    #[serde(rename = "pageSize")]
    pub page_size: String,

    /// Total field on commerce inventory stock list response.
    pub total: String,
}
