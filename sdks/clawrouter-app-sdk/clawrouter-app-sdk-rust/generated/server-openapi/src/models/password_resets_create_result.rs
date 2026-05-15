use serde::{Deserialize, Serialize};

use crate::models::{NoData};

/// Password resets create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PasswordResetsCreateResult {
    /// Business response code.
    pub code: String,

    /// No business data returned by this operation.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<NoData>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
