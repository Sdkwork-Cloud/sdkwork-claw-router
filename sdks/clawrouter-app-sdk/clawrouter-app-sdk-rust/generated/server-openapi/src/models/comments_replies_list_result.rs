use serde::{Deserialize, Serialize};

use crate::models::{ForumCommentPage};

/// Comments replies list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommentsRepliesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on comments replies list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<ForumCommentPage>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
