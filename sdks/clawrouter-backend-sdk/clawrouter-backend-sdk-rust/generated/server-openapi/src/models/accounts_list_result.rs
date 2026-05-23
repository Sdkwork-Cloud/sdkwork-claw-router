use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformAccountListResponse};

/// Accounts list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on accounts list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<OpenPlatformAccountListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
