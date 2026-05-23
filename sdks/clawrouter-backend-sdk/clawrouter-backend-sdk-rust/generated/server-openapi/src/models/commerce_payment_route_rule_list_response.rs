use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentRouteRuleItem};

/// Commerce payment route rule list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentRouteRuleListResponse {
    /// Items field on commerce payment route rule list response.
    pub items: Vec<CommercePaymentRouteRuleItem>,

    /// Page field on commerce payment route rule list response.
    pub page: i64,

    /// Page size field on commerce payment route rule list response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on commerce payment route rule list response.
    pub total: i64,
}
