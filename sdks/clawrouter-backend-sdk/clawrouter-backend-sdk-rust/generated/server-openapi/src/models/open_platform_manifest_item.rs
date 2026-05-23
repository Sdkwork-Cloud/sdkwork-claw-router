use serde::{Deserialize, Serialize};

/// Open platform manifest item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformManifestItem {
    /// Id field on open platform manifest item.
    pub id: String,

    /// Key field on open platform manifest item.
    pub key: String,

    /// Provider field on open platform manifest item.
    pub provider: String,

    /// Status field on open platform manifest item.
    pub status: String,

    /// Type field on open platform manifest item.
    pub r#type: String,

    /// Version field on open platform manifest item.
    pub version: String,
}
