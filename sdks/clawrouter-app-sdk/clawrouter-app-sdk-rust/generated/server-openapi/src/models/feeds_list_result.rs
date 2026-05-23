use serde::{Deserialize, Serialize};

use crate::models::{ForumFeedItem};

/// Feeds list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct FeedsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on feeds list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<Vec<ForumFeedItem>>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
