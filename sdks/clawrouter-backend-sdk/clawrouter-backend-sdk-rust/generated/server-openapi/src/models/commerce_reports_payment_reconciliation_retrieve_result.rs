use serde::{Deserialize, Serialize};

use crate::models::{CommerceStandardResourceResponse};

/// Commerce reports payment reconciliation retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceReportsPaymentReconciliationRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on commerce reports payment reconciliation retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceStandardResourceResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
