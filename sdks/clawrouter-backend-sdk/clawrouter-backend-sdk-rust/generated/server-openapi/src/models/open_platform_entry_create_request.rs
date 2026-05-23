use serde::{Deserialize, Serialize};

/// Open platform entry create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformEntryCreateRequest {
    /// Key field on open platform entry create request.
    pub key: String,

    /// Type field on open platform entry create request.
    pub r#type: String,

    /// Url field on open platform entry create request.
    pub url: String,
}
