use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentMethodListResponse};

/// Payments methods list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsMethodsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments methods list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentMethodListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
