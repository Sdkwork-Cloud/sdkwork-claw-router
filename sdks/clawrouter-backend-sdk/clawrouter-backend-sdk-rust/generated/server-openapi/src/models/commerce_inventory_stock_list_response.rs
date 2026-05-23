use serde::{Deserialize, Serialize};

use crate::models::{CommerceInventoryStockItem};

/// Commerce inventory stock list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryStockListResponse {
    /// Items field on commerce inventory stock list response.
    pub items: Vec<CommerceInventoryStockItem>,

    /// Page field on commerce inventory stock list response.
    pub page: i64,

    /// Page size field on commerce inventory stock list response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on commerce inventory stock list response.
    pub total: i64,
}
