use serde::{Deserialize, Serialize};

use crate::models::{ForumAuthor};

/// Forum feed item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumFeedItem {
    /// Author field on forum feed item.
    pub author: ForumAuthor,

    /// Category id field on forum feed item.
    #[serde(rename = "categoryId")]
    pub category_id: i64,

    /// Comment count field on forum feed item.
    #[serde(rename = "commentCount")]
    pub comment_count: i64,

    /// Content field on forum feed item.
    pub content: String,

    /// Content type field on forum feed item.
    #[serde(rename = "contentType")]
    pub content_type: String,

    /// Cover image field on forum feed item.
    #[serde(rename = "coverImage")]
    pub cover_image: String,

    /// Created at field on forum feed item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Id field on forum feed item.
    pub id: i64,

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
    pub like_count: i64,

    /// Share count field on forum feed item.
    #[serde(rename = "shareCount")]
    pub share_count: i64,

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
    pub view_count: i64,
}
