use serde::{Deserialize, Serialize};

use crate::models::{ForumFeedItem};

/// Feeds likes create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct FeedsLikesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on feeds likes create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<ForumFeedItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
