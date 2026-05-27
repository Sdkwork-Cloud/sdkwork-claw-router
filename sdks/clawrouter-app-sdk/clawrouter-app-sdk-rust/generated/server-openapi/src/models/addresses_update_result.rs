use serde::{Deserialize, Serialize};

use crate::models::{CommerceOperationResponse};

/// Addresses update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AddressesUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on addresses update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
