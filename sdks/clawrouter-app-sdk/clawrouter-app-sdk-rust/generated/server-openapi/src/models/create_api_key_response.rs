use serde::{Deserialize, Serialize};

use crate::models::{AppApiKeyItem};

/// Create api key response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CreateApiKeyResponse {
    /// Item field on create api key response.
    pub item: AppApiKeyItem,

    /// One-time raw API key secret. It is never returned by list/read APIs.
    #[serde(rename = "rawKey")]
    pub raw_key: String,
}
