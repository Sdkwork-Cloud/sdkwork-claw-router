use serde::{Deserialize, Serialize};

use crate::models::{CommercePriceListItem};

/// Commerce price list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePriceListResponse {
    /// Items field on commerce price list response.
    pub items: Vec<CommercePriceListItem>,

    /// Page field on commerce price list response.
    pub page: i64,

    /// Page size field on commerce price list response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on commerce price list response.
    pub total: i64,
}
