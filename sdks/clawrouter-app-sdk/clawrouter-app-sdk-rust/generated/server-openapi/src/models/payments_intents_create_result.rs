use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentIntentResponse};

/// Payments intents create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsIntentsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments intents create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentIntentResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
