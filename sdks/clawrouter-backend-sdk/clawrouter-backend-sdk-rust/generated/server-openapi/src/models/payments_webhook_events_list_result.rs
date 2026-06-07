use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentWebhookEventListResponse};

/// Payments webhook events list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsWebhookEventsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments webhook events list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentWebhookEventListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
