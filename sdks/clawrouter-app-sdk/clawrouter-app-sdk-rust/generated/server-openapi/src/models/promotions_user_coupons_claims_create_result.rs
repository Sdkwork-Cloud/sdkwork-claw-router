use serde::{Deserialize, Serialize};

use crate::models::{PromotionOperationResponse};

/// Promotions user coupons claims create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionsUserCouponsClaimsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on promotions user coupons claims create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<PromotionOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
