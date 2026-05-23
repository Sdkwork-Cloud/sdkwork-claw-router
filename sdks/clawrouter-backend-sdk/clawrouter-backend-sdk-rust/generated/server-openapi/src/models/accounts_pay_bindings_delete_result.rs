use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformPayBindingResponse};

/// Accounts pay bindings delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountsPayBindingsDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on accounts pay bindings delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<OpenPlatformPayBindingResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
