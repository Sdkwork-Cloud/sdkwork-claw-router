use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentReconciliationRunItem};

/// Commerce payment reconciliation run list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentReconciliationRunListResponse {
    /// Items field on commerce payment reconciliation run list response.
    pub items: Vec<CommercePaymentReconciliationRunItem>,

    /// Page field on commerce payment reconciliation run list response.
    pub page: i64,

    /// Page size field on commerce payment reconciliation run list response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on commerce payment reconciliation run list response.
    pub total: i64,
}
