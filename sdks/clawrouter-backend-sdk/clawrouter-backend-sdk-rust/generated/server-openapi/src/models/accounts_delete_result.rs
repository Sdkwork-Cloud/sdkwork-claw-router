use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformAccountResponse};

/// Accounts delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountsDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on accounts delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<OpenPlatformAccountResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
