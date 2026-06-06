use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Admin skill artifact create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillArtifactCreateRequest {
    /// Artifact field on admin skill artifact create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact: Option<MediaResource>,

    /// Artifact ref field on admin skill artifact create request.
    #[serde(rename = "artifactRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_ref: Option<String>,

    /// Artifact size bytes field on admin skill artifact create request.
    #[serde(rename = "artifactSizeBytes")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_size_bytes: Option<String>,

    /// Artifact type field on admin skill artifact create request.
    #[serde(rename = "artifactType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_type: Option<i64>,

    /// Checksum hash field on admin skill artifact create request.
    #[serde(rename = "checksumHash")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub checksum_hash: Option<String>,

    /// Deprecated at field on admin skill artifact create request.
    #[serde(rename = "deprecatedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deprecated_at: Option<String>,

    /// Frameworks field on admin skill artifact create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub frameworks: Option<Vec<String>>,

    /// License name field on admin skill artifact create request.
    #[serde(rename = "licenseName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license_name: Option<String>,

    /// Os name field on admin skill artifact create request.
    #[serde(rename = "osName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub os_name: Option<String>,

    /// Platform type field on admin skill artifact create request.
    #[serde(rename = "platformType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub platform_type: Option<String>,

    /// Published at field on admin skill artifact create request.
    #[serde(rename = "publishedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Release notes field on admin skill artifact create request.
    #[serde(rename = "releaseNotes")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub release_notes: Option<String>,

    /// Runtime field on admin skill artifact create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Status field on admin skill artifact create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<i64>,

    /// Version field on admin skill artifact create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
