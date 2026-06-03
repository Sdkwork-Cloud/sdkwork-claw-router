use serde::{Deserialize, Serialize};

use crate::models::{AdminSiteModelsReplaceResponse};

/// Site models replace result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SiteModelsReplaceResult {
    /// Business response code.
    pub code: String,

    /// Data field on site models replace result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSiteModelsReplaceResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
