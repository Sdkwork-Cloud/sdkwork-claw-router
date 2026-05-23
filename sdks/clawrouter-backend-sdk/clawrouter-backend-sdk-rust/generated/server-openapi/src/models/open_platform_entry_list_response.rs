use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformEntryItem};

/// Open platform entry list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformEntryListResponse {
    /// Items field on open platform entry list response.
    pub items: Vec<OpenPlatformEntryItem>,
}
