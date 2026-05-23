use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentChannelItem};

/// Commerce payment channel list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentChannelListResponse {
    /// Items field on commerce payment channel list response.
    pub items: Vec<CommercePaymentChannelItem>,

    /// Page field on commerce payment channel list response.
    pub page: i64,

    /// Page size field on commerce payment channel list response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on commerce payment channel list response.
    pub total: i64,
}
