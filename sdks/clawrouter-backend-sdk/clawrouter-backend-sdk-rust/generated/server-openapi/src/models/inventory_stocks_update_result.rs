use serde::{Deserialize, Serialize};

use crate::models::{CommerceInventoryStockMutationResponse};

/// Inventory stocks update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct InventoryStocksUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on inventory stocks update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceInventoryStockMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
