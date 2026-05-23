use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformEntryResponse};

/// Accounts entries delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountsEntriesDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on accounts entries delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<OpenPlatformEntryResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
