use serde::{Deserialize, Serialize};

/// Skill package item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillPackageItem {
    /// Artifact ref field on skill package item.
    #[serde(rename = "artifactRef")]
    pub artifact_ref: String,

    /// Artifact size bytes field on skill package item.
    #[serde(rename = "artifactSizeBytes")]
    pub artifact_size_bytes: i64,

    /// Frameworks field on skill package item.
    pub frameworks: Vec<String>,

    /// Id field on skill package item.
    pub id: String,

    /// License name field on skill package item.
    #[serde(rename = "licenseName")]
    pub license_name: String,

    /// Published at field on skill package item.
    #[serde(rename = "publishedAt")]
    pub published_at: String,

    /// Version field on skill package item.
    pub version: String,
}
