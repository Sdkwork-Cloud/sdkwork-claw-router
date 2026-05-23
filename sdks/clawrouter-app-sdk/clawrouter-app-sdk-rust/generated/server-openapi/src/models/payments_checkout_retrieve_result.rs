use serde::{Deserialize, Serialize};

use crate::models::{CheckoutStatusResponse};

/// Payments checkout retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsCheckoutRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments checkout retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CheckoutStatusResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
