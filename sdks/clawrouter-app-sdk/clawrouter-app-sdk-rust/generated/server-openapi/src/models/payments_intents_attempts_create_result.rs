use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentAttemptResponse};

/// Payments intents attempts create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsIntentsAttemptsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments intents attempts create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentAttemptResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
