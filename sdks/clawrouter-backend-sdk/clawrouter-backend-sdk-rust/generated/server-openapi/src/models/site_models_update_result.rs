use serde::{Deserialize, Serialize};

use crate::models::{AdminSiteModelMutationResponse};

/// Site models update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SiteModelsUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on site models update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSiteModelMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
