use serde::{Deserialize, Serialize};

use crate::models::{AccountSummaryResponse};

/// Account summary retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountSummaryRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on account summary retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AccountSummaryResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
