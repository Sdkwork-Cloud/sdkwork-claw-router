use serde::{Deserialize, Serialize};

use crate::models::{CommerceCouponCatalogItem};

/// Coupons catalog list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CouponsCatalogListResult {
    /// Business response code.
    pub code: String,

    /// Data field on coupons catalog list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<Vec<CommerceCouponCatalogItem>>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
