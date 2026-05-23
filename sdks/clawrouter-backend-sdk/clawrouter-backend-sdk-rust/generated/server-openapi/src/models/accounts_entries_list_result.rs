use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformEntryListResponse};

/// Accounts entries list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountsEntriesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on accounts entries list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<OpenPlatformEntryListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
