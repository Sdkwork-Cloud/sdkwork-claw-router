use serde::{Deserialize, Serialize};

use crate::models::{AdminCouponItem};

/// Admin coupon mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCouponMutationResponse {
    /// Item field on admin coupon mutation response.
    pub item: AdminCouponItem,
}
