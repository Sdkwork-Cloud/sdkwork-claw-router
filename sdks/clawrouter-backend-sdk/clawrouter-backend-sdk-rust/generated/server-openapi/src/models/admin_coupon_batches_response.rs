use serde::{Deserialize, Serialize};

use crate::models::{AdminCouponBatchItem};

/// Admin coupon batches response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCouponBatchesResponse {
    /// Items field on admin coupon batches response.
    pub items: Vec<AdminCouponBatchItem>,
}
