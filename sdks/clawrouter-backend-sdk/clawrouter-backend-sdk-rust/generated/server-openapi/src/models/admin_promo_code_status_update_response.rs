use serde::{Deserialize, Serialize};

/// Admin promo code status update response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminPromoCodeStatusUpdateResponse {
    /// Whether the promo code status was updated.
    pub updated: bool,
}
