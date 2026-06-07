use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentAttemptItem};

/// Commerce payment attempt list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentAttemptListResponse {
    /// Items field on commerce payment attempt list response.
    pub items: Vec<CommercePaymentAttemptItem>,

    /// Page field on commerce payment attempt list response.
    pub page: String,

    /// Page size field on commerce payment attempt list response.
    #[serde(rename = "pageSize")]
    pub page_size: String,

    /// Total field on commerce payment attempt list response.
    pub total: String,
}
