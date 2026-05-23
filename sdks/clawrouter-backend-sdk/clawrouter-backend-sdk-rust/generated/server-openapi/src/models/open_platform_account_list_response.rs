use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformAccountItem};

/// Open platform account list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformAccountListResponse {
    /// Items field on open platform account list response.
    pub items: Vec<OpenPlatformAccountItem>,
}
