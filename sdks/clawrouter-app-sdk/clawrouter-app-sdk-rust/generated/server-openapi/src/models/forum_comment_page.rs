use serde::{Deserialize, Serialize};

use crate::models::{ForumCommentItem};

/// Forum comment page schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumCommentPage {
    /// Content field on forum comment page.
    pub content: Vec<ForumCommentItem>,

    /// Items field on forum comment page.
    pub items: Vec<ForumCommentItem>,

    /// Page field on forum comment page.
    pub page: i64,

    /// Size field on forum comment page.
    pub size: i64,

    /// Total elements field on forum comment page.
    #[serde(rename = "totalElements")]
    pub total_elements: i64,
}
