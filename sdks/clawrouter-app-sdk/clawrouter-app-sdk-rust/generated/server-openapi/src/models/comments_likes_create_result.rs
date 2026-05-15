use serde::{Deserialize, Serialize};

use crate::models::{ForumCommentItem};

/// Comments likes create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommentsLikesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on comments likes create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<ForumCommentItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
