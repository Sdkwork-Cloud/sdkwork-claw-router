use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillAssetListResponse};

/// Skills assets list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsAssetsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on skills assets list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminSkillAssetListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
