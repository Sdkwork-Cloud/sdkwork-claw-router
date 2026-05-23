use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformAccountItem};

/// Open platform account response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformAccountResponse {
    /// Item field on open platform account response.
    pub item: OpenPlatformAccountItem,
}
