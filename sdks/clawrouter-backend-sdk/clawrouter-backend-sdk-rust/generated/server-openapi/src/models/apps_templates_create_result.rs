use serde::{Deserialize, Serialize};

use crate::models::{AdminAppTemplateMutationResponse};

/// Apps templates create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppsTemplatesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on apps templates create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAppTemplateMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
