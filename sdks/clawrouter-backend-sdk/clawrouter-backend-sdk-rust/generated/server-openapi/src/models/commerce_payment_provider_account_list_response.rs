use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentProviderAccountItem};

/// Commerce payment provider account list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentProviderAccountListResponse {
    /// Items field on commerce payment provider account list response.
    pub items: Vec<CommercePaymentProviderAccountItem>,

    /// Page field on commerce payment provider account list response.
    pub page: i64,

    /// Page size field on commerce payment provider account list response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on commerce payment provider account list response.
    pub total: i64,
}
