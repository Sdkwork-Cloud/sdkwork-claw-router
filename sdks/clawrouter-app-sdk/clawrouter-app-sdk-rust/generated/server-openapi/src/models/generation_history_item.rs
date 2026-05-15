use serde::{Deserialize, Serialize};

use crate::models::{GenerationHistoryMediaItem};

/// Generation history item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationHistoryItem {
    /// Created at field on generation history item.
    #[serde(rename = "createdAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Date field on generation history item.
    pub date: String,

    /// Id field on generation history item.
    pub id: String,

    /// Images field on generation history item.
    pub images: Vec<String>,

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
