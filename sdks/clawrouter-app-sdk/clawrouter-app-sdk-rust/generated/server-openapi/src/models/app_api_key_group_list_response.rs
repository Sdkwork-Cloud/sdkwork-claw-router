use serde::{Deserialize, Serialize};

use crate::models::{AppApiKeyGroup};

/// App api key group list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppApiKeyGroupListResponse {
    /// Items field on app api key group list response.
    pub items: Vec<AppApiKeyGroup>,
}
