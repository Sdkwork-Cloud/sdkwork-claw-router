use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentMethodItem};

/// Commerce payment method list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentMethodListResponse {
    /// Items field on commerce payment method list response.
    pub items: Vec<CommercePaymentMethodItem>,

    /// Page field on commerce payment method list response.
    pub page: String,

    /// Page size field on commerce payment method list response.
    #[serde(rename = "pageSize")]
    pub page_size: String,

    /// Total field on commerce payment method list response.
    pub total: String,
}
