use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentReconciliationRunListResponse};

/// Payments reconciliation runs list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsReconciliationRunsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments reconciliation runs list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentReconciliationRunListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
