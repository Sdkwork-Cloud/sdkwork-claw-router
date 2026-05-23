use serde::{Deserialize, Serialize};

/// Open platform provider item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformProviderItem {
    /// Id field on open platform provider item.
    pub id: String,

    /// Name field on open platform provider item.
    pub name: String,

    /// Provider field on open platform provider item.
    pub provider: String,

    /// Status field on open platform provider item.
    pub status: String,
}
