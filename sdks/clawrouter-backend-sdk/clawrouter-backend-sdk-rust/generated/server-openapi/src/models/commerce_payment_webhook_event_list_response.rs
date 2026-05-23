use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentWebhookEventItem};

/// Commerce payment webhook event list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentWebhookEventListResponse {
    /// Items field on commerce payment webhook event list response.
    pub items: Vec<CommercePaymentWebhookEventItem>,

    /// Page field on commerce payment webhook event list response.
    pub page: i64,

    /// Page size field on commerce payment webhook event list response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on commerce payment webhook event list response.
    pub total: i64,
}
