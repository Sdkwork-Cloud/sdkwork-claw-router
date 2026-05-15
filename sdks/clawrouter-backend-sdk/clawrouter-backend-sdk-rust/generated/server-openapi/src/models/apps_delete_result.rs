use serde::{Deserialize, Serialize};

use crate::models::{AdminAppDeleteResponse};

/// Apps delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppsDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on apps delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAppDeleteResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
