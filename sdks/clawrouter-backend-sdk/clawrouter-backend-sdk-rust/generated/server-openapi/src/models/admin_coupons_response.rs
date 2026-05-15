use serde::{Deserialize, Serialize};

use crate::models::{AdminCouponItem};

/// Admin coupons response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCouponsResponse {
    /// Items field on admin coupons response.
    pub items: Vec<AdminCouponItem>,
}
