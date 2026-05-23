use serde::{Deserialize, Serialize};

use crate::models::{GenerationHistoryMediaItem};

/// Generation history item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationHistoryItem {
    /// Aspect ratio field on generation history item.
    #[serde(rename = "aspectRatio")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub aspect_ratio: Option<String>,

    /// Created at field on generation history item.
    #[serde(rename = "createdAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Date field on generation history item.
    pub date: String,

    /// Duration seconds field on generation history item.
    #[serde(rename = "durationSeconds")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<i64>,

    /// Id field on generation history item.
    pub id: String,

    /// Images field on generation history item.
    pub images: Vec<String>,

    /// Model catalog key field on generation history item.
    #[serde(rename = "modelCatalogKey")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_catalog_key: Option<String>,

    /// Model info field on generation history item.
    #[serde(rename = "modelInfo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_info: Option<String>,

    /// Prompt field on generation history item.
    pub prompt: String,

    /// Status field on generation history item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Type field on generation history item.
    pub r#type: String,

    /// Updated at field on generation history item.
    #[serde(rename = "updatedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Url field on generation history item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,

    /// Videos field on generation history item.
    pub videos: Vec<GenerationHistoryMediaItem>,
}
