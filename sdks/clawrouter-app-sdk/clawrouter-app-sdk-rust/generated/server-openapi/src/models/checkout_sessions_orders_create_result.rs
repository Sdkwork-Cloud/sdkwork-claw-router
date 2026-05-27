use serde::{Deserialize, Serialize};

use crate::models::{CommerceOperationResponse};

/// Checkout sessions orders create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CheckoutSessionsOrdersCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on checkout sessions orders create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
