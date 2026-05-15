use serde::{Deserialize, Serialize};

use crate::models::{AdminAppMutationResponse};

/// Apps unpublish result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppsUnpublishResult {
    /// Business response code.
    pub code: String,

    /// Data field on apps unpublish result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAppMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
