use serde::{Deserialize, Serialize};

/// Open platform entry update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformEntryUpdateRequest {
    /// Key field on open platform entry update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub key: Option<String>,

    /// Status field on open platform entry update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Type field on open platform entry update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub r#type: Option<String>,

    /// Url field on open platform entry update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
}
