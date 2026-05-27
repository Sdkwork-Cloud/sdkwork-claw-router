use serde::{Deserialize, Serialize};

use crate::models::{AdminAppTemplateDeleteResponse};

/// Apps templates delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppsTemplatesDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on apps templates delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAppTemplateDeleteResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
