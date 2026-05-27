use serde::{Deserialize, Serialize};

use crate::models::{PromotionUserCouponWalletListResponse};

/// Promotions user coupons wallet list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionsUserCouponsWalletListResult {
    /// Business response code.
    pub code: String,

    /// Data field on promotions user coupons wallet list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<PromotionUserCouponWalletListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
