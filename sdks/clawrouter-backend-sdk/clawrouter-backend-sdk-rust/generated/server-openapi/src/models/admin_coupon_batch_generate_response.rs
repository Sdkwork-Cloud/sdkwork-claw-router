use serde::{Deserialize, Serialize};

use crate::models::{AdminCouponBatchItem, AdminPromoCodeItem};

/// Admin coupon batch generate response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCouponBatchGenerateResponse {
    /// Batch field on admin coupon batch generate response.
    pub batch: AdminCouponBatchItem,

    /// Generated promo code snapshots returned by the backend.
    pub codes: Vec<AdminPromoCodeItem>,
}
