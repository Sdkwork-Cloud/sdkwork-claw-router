use serde::{Deserialize, Serialize};

use crate::models::{PromotionCouponWalletItem};

/// Promotion user coupon wallet list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionUserCouponWalletListResponse {
    /// Items field on promotion user coupon wallet list response.
    pub items: Vec<PromotionCouponWalletItem>,
}
