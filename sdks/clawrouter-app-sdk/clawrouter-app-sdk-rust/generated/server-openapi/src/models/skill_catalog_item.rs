use serde::{Deserialize, Serialize};

use crate::models::{MediaResource, SkillPackageItem};

/// Skill catalog item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillCatalogItem {
    /// Category field on skill catalog item.
    pub category: String,

    /// Clawhub image field on skill catalog item.
    #[serde(rename = "clawhubImage")]
    pub clawhub_image: String,

    /// Description field on skill catalog item.
    pub description: String,

    /// Developer field on skill catalog item.
    pub developer: String,

    /// Downloads field on skill catalog item.
    pub downloads: String,

    /// Features field on skill catalog item.
    pub features: Vec<String>,

    /// Frameworks field on skill catalog item.
    pub frameworks: Vec<String>,

    /// Id field on skill catalog item.
    pub id: String,

    /// Image field on skill catalog item.
    pub image: MediaResource,

    /// Last updated field on skill catalog item.
    #[serde(rename = "lastUpdated")]
    pub last_updated: String,

    /// License field on skill catalog item.
    pub license: String,

    /// Name field on skill catalog item.
    pub name: String,

    /// Packages field on skill catalog item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub packages: Option<Vec<SkillPackageItem>>,

    /// Rating field on skill catalog item.
    pub rating: f64,

    /// Screenshots field on skill catalog item.
    pub screenshots: Vec<MediaResource>,

    /// Size field on skill catalog item.
    pub size: String,

    /// Version field on skill catalog item.
    pub version: String,
}
