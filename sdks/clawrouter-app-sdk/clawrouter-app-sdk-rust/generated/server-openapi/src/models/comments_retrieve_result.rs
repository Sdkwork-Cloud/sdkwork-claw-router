use serde::{Deserialize, Serialize};

use crate::models::{ForumCommentDetail};

/// Comments retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommentsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on comments retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<ForumCommentDetail>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
