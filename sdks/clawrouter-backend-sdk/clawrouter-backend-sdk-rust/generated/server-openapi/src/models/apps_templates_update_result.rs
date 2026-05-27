use serde::{Deserialize, Serialize};

use crate::models::{AdminAppTemplateMutationResponse};

/// Apps templates update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppsTemplatesUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on apps templates update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAppTemplateMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
