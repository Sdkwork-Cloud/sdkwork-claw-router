use serde::{Deserialize, Serialize};

use crate::models::{ForumCommentItem};

/// Comments likes current delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommentsLikesCurrentDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on comments likes current delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<ForumCommentItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
