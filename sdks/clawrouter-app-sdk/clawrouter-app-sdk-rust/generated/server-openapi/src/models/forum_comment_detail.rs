use serde::{Deserialize, Serialize};

use crate::models::{ForumAuthor, ForumCommentItem};

/// Forum comment detail schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumCommentDetail {
    /// Author field on forum comment detail.
    pub author: ForumAuthor,

    /// Comment id field on forum comment detail.
    #[serde(rename = "commentId")]
    pub comment_id: String,

    /// Content field on forum comment detail.
    pub content: String,

    /// Content id field on forum comment detail.
    #[serde(rename = "contentId")]
    pub content_id: i64,

    /// Content type field on forum comment detail.
    #[serde(rename = "contentType")]
    pub content_type: String,

    /// Created at field on forum comment detail.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Device info field on forum comment detail.
    #[serde(rename = "deviceInfo")]
    pub device_info: String,

    /// Ip address field on forum comment detail.
    #[serde(rename = "ipAddress")]
    pub ip_address: String,

    /// Is top field on forum comment detail.
    #[serde(rename = "isTop")]
    pub is_top: bool,

    /// Likes field on forum comment detail.
    pub likes: i64,

    /// Parent id field on forum comment detail.
    #[serde(rename = "parentId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<i64>,

    /// Replies field on forum comment detail.
    pub replies: Vec<ForumCommentItem>,

    /// Reply count field on forum comment detail.
    #[serde(rename = "replyCount")]
    pub reply_count: i64,

    /// Status field on forum comment detail.
    pub status: String,

    /// Updated at field on forum comment detail.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// User id field on forum comment detail.
    #[serde(rename = "userId")]
    pub user_id: i64,
}
