use serde::{Deserialize, Serialize};

use crate::models::{CommerceInventoryLedgerListResponse};

/// Inventory ledger entries list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct InventoryLedgerEntriesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on inventory ledger entries list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceInventoryLedgerListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
