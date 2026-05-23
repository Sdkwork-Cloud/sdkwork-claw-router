use serde::{Deserialize, Serialize};

use crate::models::{ProvidersResponse};

/// Providers list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ProvidersListResult {
    /// Business response code.
    pub code: String,

    /// Data field on providers list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<ProvidersResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
