use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformPayBindingListResponse};

/// Accounts pay bindings list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountsPayBindingsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on accounts pay bindings list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<OpenPlatformPayBindingListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
