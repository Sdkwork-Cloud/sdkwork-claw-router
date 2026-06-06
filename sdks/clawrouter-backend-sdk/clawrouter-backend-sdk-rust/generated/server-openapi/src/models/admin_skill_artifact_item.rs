use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Updated skill catalog artifact snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillArtifactItem {
    /// Artifact field on admin skill artifact item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact: Option<MediaResource>,

    /// Artifact ref field on admin skill artifact item.
    #[serde(rename = "artifactRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_ref: Option<String>,

    /// Artifact size bytes field on admin skill artifact item.
    #[serde(rename = "artifactSizeBytes")]
    pub artifact_size_bytes: String,

    /// Artifact type field on admin skill artifact item.
    #[serde(rename = "artifactType")]
    pub artifact_type: i64,

    /// Checksum hash field on admin skill artifact item.
    #[serde(rename = "checksumHash")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub checksum_hash: Option<String>,

    /// Created at field on admin skill artifact item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Deprecated at field on admin skill artifact item.
    #[serde(rename = "deprecatedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deprecated_at: Option<String>,

    /// Frameworks field on admin skill artifact item.
    pub frameworks: Vec<String>,

    /// Id field on admin skill artifact item.
    pub id: String,

    /// License name field on admin skill artifact item.
    #[serde(rename = "licenseName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license_name: Option<String>,

    /// Os name field on admin skill artifact item.
    #[serde(rename = "osName")]
    pub os_name: String,

    /// Platform type field on admin skill artifact item.
    #[serde(rename = "platformType")]
    pub platform_type: String,

    /// Published at field on admin skill artifact item.
    #[serde(rename = "publishedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Release notes field on admin skill artifact item.
    #[serde(rename = "releaseNotes")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub release_notes: Option<String>,

    /// Runtime field on admin skill artifact item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Skill id field on admin skill artifact item.
    #[serde(rename = "skillId")]
    pub skill_id: String,

    /// Status field on admin skill artifact item.
    pub status: i64,

    /// Target id field on admin skill artifact item.
    #[serde(rename = "targetId")]
    pub target_id: String,

    /// Target type field on admin skill artifact item.
    #[serde(rename = "targetType")]
    pub target_type: i64,

    /// Updated at field on admin skill artifact item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// Version field on admin skill artifact item.
    pub version: String,
}
