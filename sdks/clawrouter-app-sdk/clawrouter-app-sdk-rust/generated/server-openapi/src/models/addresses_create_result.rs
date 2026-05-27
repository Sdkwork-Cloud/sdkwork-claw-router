use serde::{Deserialize, Serialize};

use crate::models::{CommerceOperationResponse};

/// Addresses create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AddressesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on addresses create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
