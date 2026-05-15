use serde::{Deserialize, Serialize};

use crate::models::{AppApiKeyGroup, AppApiKeyItem};

/// App api key list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppApiKeyListResponse {
    /// Groups field on app api key list response.
    pub groups: Vec<AppApiKeyGroup>,

    /// Items field on app api key list response.
    pub items: Vec<AppApiKeyItem>,
}
