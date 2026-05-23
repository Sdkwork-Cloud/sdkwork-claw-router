use serde::{Deserialize, Serialize};

use crate::models::{AdminAppMutationResponse};

/// Apps retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on apps retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAppMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
