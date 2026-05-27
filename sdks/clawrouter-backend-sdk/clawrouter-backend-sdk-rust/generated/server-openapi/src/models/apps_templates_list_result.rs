use serde::{Deserialize, Serialize};

use crate::models::{AdminAppTemplateListResponse};

/// Apps templates list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppsTemplatesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on apps templates list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAppTemplateListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
