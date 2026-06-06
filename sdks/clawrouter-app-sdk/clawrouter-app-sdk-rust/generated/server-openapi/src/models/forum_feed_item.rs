use serde::{Deserialize, Serialize};

use crate::models::{ForumAuthor, MediaResource};

/// Forum feed item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumFeedItem {
    /// Author field on forum feed item.
    pub author: ForumAuthor,

    /// Category id field on forum feed item.
    #[serde(rename = "categoryId")]
    pub category_id: String,

    /// Comment count field on forum feed item.
    #[serde(rename = "commentCount")]
    pub comment_count: String,

    /// Content field on forum feed item.
    pub content: String,

    /// Content type field on forum feed item.
    #[serde(rename = "contentType")]
    pub content_type: String,

    /// Cover field on forum feed item.
    pub cover: MediaResource,

    /// Created at field on forum feed item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Id field on forum feed item.
    pub id: String,

    /// Is collected field on forum feed item.
    #[serde(rename = "isCollected")]
    pub is_collected: bool,

    /// Is hot field on forum feed item.
    #[serde(rename = "isHot")]
    pub is_hot: bool,

    /// Is liked field on forum feed item.
    #[serde(rename = "isLiked")]
    pub is_liked: bool,

    /// Is recommended field on forum feed item.
    #[serde(rename = "isRecommended")]
    pub is_recommended: bool,

    /// Is top field on forum feed item.
    #[serde(rename = "isTop")]
    pub is_top: bool,

    /// Like count field on forum feed item.
    #[serde(rename = "likeCount")]
    pub like_count: String,

    /// Share count field on forum feed item.
    #[serde(rename = "shareCount")]
    pub share_count: String,

    /// Summary field on forum feed item.
    pub summary: String,

    /// Tags field on forum feed item.
    pub tags: Vec<String>,

    /// Title field on forum feed item.
    pub title: String,

    /// Updated at field on forum feed item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// View count field on forum feed item.
    #[serde(rename = "viewCount")]
    pub view_count: String,
}
