use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformManifestItem};

/// Open platform manifest list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformManifestListResponse {
    /// Items field on open platform manifest list response.
    pub items: Vec<OpenPlatformManifestItem>,
}
