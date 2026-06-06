use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentProviderItem};

/// Commerce payment provider list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentProviderListResponse {
    /// Items field on commerce payment provider list response.
    pub items: Vec<CommercePaymentProviderItem>,

    /// Page field on commerce payment provider list response.
    pub page: String,

    /// Page size field on commerce payment provider list response.
    #[serde(rename = "pageSize")]
    pub page_size: String,

    /// Total field on commerce payment provider list response.
    pub total: String,
}
