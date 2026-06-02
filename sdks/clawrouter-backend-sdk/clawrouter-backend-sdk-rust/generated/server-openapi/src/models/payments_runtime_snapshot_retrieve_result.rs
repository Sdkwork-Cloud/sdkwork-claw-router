use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentRuntimeSnapshotResponse};

/// Payments runtime snapshot retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsRuntimeSnapshotRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments runtime snapshot retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentRuntimeSnapshotResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
