use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentIntentItem};

/// Commerce payment intent list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentIntentListResponse {
    /// Items field on commerce payment intent list response.
    pub items: Vec<CommercePaymentIntentItem>,

    /// Page field on commerce payment intent list response.
    pub page: String,

    /// Page size field on commerce payment intent list response.
    #[serde(rename = "pageSize")]
    pub page_size: String,

    /// Total field on commerce payment intent list response.
    pub total: String,
}
