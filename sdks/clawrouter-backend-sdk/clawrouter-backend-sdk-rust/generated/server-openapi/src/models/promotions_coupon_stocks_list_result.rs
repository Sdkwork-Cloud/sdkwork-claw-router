use serde::{Deserialize, Serialize};

use crate::models::{PromotionCollectionResponse};

/// Promotions coupon stocks list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionsCouponStocksListResult {
    /// Business response code.
    pub code: String,

    /// Data field on promotions coupon stocks list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<PromotionCollectionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
