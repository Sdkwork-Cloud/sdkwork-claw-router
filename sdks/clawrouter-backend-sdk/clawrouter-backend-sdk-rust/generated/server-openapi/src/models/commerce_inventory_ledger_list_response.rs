use serde::{Deserialize, Serialize};

use crate::models::{CommerceInventoryLedgerItem};

/// Commerce inventory ledger list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryLedgerListResponse {
    /// Items field on commerce inventory ledger list response.
    pub items: Vec<CommerceInventoryLedgerItem>,

    /// Page field on commerce inventory ledger list response.
    pub page: String,

    /// Page size field on commerce inventory ledger list response.
    #[serde(rename = "pageSize")]
    pub page_size: String,

    /// Total field on commerce inventory ledger list response.
    pub total: String,
}
