use serde::{Deserialize, Serialize};

use crate::models::{CommerceInventoryStockItem};

/// Commerce inventory stock mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryStockMutationResponse {
    /// Item field on commerce inventory stock mutation response.
    pub item: CommerceInventoryStockItem,
}
