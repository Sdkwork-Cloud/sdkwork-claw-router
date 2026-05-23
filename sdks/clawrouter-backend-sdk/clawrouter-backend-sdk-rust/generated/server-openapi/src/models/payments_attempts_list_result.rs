use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentAttemptListResponse};

/// Payments attempts list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsAttemptsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments attempts list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentAttemptListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
