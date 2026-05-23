use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentIntentListResponse};

/// Payments intents list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsIntentsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments intents list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentIntentListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
