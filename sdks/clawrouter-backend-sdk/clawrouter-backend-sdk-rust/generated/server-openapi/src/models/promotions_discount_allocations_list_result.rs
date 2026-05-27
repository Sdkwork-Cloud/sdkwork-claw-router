use serde::{Deserialize, Serialize};

use crate::models::{PromotionCollectionResponse};

/// Promotions discount allocations list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionsDiscountAllocationsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on promotions discount allocations list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<PromotionCollectionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
