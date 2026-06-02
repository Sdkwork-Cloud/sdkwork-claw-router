use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Updated skill catalog asset snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillAssetItem {
    /// Alt text field on admin skill asset item.
    #[serde(rename = "altText")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub alt_text: Option<String>,

    /// Artifact id field on admin skill asset item.
    #[serde(rename = "artifactId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_id: Option<String>,

    /// Asset field on admin skill asset item.
    pub asset: MediaResource,

    /// Asset type field on admin skill asset item.
    #[serde(rename = "assetType")]
    pub asset_type: i64,

    /// Created at field on admin skill asset item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Duration seconds field on admin skill asset item.
    #[serde(rename = "durationSeconds")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<String>,

    /// File size field on admin skill asset item.
    #[serde(rename = "fileSize")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_size: Option<i64>,

    /// Height field on admin skill asset item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub height: Option<i64>,

    /// Id field on admin skill asset item.
    pub id: String,

    /// Mime type field on admin skill asset item.
    #[serde(rename = "mimeType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mime_type: Option<String>,

    /// Published at field on admin skill asset item.
    #[serde(rename = "publishedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Skill id field on admin skill asset item.
    #[serde(rename = "skillId")]
    pub skill_id: String,

    /// Sort order field on admin skill asset item.
    #[serde(rename = "sortOrder")]
    pub sort_order: i64,

    /// Status field on admin skill asset item.
    pub status: i64,

    /// Target id field on admin skill asset item.
    #[serde(rename = "targetId")]
    pub target_id: String,

    /// Target type field on admin skill asset item.
    #[serde(rename = "targetType")]
    pub target_type: i64,

    /// Thumbnail field on admin skill asset item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<MediaResource>,

    /// Title field on admin skill asset item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on admin skill asset item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// Width field on admin skill asset item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub width: Option<i64>,
}
