use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformProviderItem};

/// Open platform provider list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformProviderListResponse {
    /// Items field on open platform provider list response.
    pub items: Vec<OpenPlatformProviderItem>,
}
