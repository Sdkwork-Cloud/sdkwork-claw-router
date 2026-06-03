use serde::{Deserialize, Serialize};

use crate::models::{AdminSiteModelsResponse};

/// Site models list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SiteModelsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on site models list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSiteModelsResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
