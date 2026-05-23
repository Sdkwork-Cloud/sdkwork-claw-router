use serde::{Deserialize, Serialize};

use crate::models::{AdminApiKeysMapResponse};

/// Api keys list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ApiKeysListResult {
    /// Business response code.
    pub code: String,

    /// Data field on api keys list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminApiKeysMapResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
