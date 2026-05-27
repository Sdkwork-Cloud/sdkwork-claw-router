use serde::{Deserialize, Serialize};

use crate::models::{CommerceOperationResponse};

/// Cart items create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CartItemsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on cart items create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
