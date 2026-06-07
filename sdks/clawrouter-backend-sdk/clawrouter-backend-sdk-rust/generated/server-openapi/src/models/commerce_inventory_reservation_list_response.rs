use serde::{Deserialize, Serialize};

use crate::models::{CommerceInventoryReservationItem};

/// Commerce inventory reservation list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryReservationListResponse {
    /// Items field on commerce inventory reservation list response.
    pub items: Vec<CommerceInventoryReservationItem>,

    /// Page field on commerce inventory reservation list response.
    pub page: String,

    /// Page size field on commerce inventory reservation list response.
    #[serde(rename = "pageSize")]
    pub page_size: String,

    /// Total field on commerce inventory reservation list response.
    pub total: String,
}
