use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Admin skill asset create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillAssetCreateRequest {
    /// Alt text field on admin skill asset create request.
    #[serde(rename = "altText")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub alt_text: Option<String>,

    /// Artifact id field on admin skill asset create request.
    #[serde(rename = "artifactId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_id: Option<String>,

    /// Asset field on admin skill asset create request.
    pub asset: MediaResource,

    /// Asset type field on admin skill asset create request.
    #[serde(rename = "assetType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub asset_type: Option<i64>,

    /// Duration seconds field on admin skill asset create request.
    #[serde(rename = "durationSeconds")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<String>,

    /// File size field on admin skill asset create request.
    #[serde(rename = "fileSize")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_size: Option<i64>,

    /// Height field on admin skill asset create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub height: Option<i64>,

    /// Mime type field on admin skill asset create request.
    #[serde(rename = "mimeType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mime_type: Option<String>,

    /// Published at field on admin skill asset create request.
    #[serde(rename = "publishedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Sort order field on admin skill asset create request.
    #[serde(rename = "sortOrder")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on admin skill asset create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<i64>,

    /// Thumbnail field on admin skill asset create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<MediaResource>,

    /// Title field on admin skill asset create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Width field on admin skill asset create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub width: Option<i64>,
}
