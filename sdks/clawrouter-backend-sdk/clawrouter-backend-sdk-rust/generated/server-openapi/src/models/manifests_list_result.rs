use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformManifestListResponse};

/// Manifests list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ManifestsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on manifests list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<OpenPlatformManifestListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
