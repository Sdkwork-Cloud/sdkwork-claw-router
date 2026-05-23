use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformEntryItem};

/// Open platform entry response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformEntryResponse {
    /// Item field on open platform entry response.
    pub item: OpenPlatformEntryItem,
}
