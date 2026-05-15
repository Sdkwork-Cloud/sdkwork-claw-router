use serde::{Deserialize, Serialize};

/// Admin promo code status update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminPromoCodeStatusUpdateRequest {
    /// New promo code lifecycle status.
    pub status: String,
}
