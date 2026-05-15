use serde::{Deserialize, Serialize};

use crate::models::{AdminPromoCodeItem};

/// Admin promo codes response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminPromoCodesResponse {
    /// Items field on admin promo codes response.
    pub items: Vec<AdminPromoCodeItem>,
}
