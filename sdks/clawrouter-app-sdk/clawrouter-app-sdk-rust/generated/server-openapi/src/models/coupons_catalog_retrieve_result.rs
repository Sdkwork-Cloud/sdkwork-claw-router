use serde::{Deserialize, Serialize};

use crate::models::{CommerceCouponCatalogItem};

/// Coupons catalog retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CouponsCatalogRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on coupons catalog retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceCouponCatalogItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
