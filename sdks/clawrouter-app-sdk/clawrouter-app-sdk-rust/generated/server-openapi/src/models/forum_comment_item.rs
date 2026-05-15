use serde::{Deserialize, Serialize};

use crate::models::{ForumAuthor};

/// Forum comment item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumCommentItem {
    /// Author field on forum comment item.
    pub author: ForumAuthor,

    /// Comment id field on forum comment item.
    #[serde(rename = "commentId")]
    pub comment_id: String,

    /// Content field on forum comment item.
    pub content: String,

    /// Content id field on forum comment item.
    #[serde(rename = "contentId")]
    pub content_id: i64,

    /// Content type field on forum comment item.
    #[serde(rename = "contentType")]
    pub content_type: String,

    /// Created at field on forum comment item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Is top field on forum comment item.
    #[serde(rename = "isTop")]
    pub is_top: bool,

    /// Likes field on forum comment item.
    pub likes: i64,

    /// Parent id field on forum comment item.
    #[serde(rename = "parentId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<i64>,

    /// Reply count field on forum comment item.
    #[serde(rename = "replyCount")]
    pub reply_count: i64,

    /// Status field on forum comment item.
    pub status: String,

    /// User id field on forum comment item.
    #[serde(rename = "userId")]
    pub user_id: i64,
}
