use serde::{Deserialize, Serialize};

use crate::models::{ForumFeedItem};

/// Feeds collections create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct FeedsCollectionsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on feeds collections create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<ForumFeedItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
