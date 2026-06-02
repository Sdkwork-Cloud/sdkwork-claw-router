use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Forum create feed request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumCreateFeedRequest {
    /// Category id field on forum create feed request.
    #[serde(rename = "categoryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<i64>,

    /// Content field on forum create feed request.
    pub content: String,

    /// Images field on forum create feed request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub images: Option<Vec<MediaResource>>,

    /// Source field on forum create feed request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,

    /// Source url field on forum create feed request.
    #[serde(rename = "sourceUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_url: Option<String>,

    /// Tags field on forum create feed request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,

    /// Title field on forum create feed request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
}
