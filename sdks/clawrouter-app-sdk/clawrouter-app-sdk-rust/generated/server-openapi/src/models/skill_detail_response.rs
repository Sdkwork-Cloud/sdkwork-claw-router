use serde::{Deserialize, Serialize};

use crate::models::{MediaResource, SkillPackageItem};

/// Skill detail response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillDetailResponse {
    /// Category field on skill detail response.
    pub category: String,

    /// Clawhub image field on skill detail response.
    #[serde(rename = "clawhubImage")]
    pub clawhub_image: String,

    /// Description field on skill detail response.
    pub description: String,

    /// Developer field on skill detail response.
    pub developer: String,

    /// Downloads field on skill detail response.
    pub downloads: String,

    /// Features field on skill detail response.
    pub features: Vec<String>,

    /// Frameworks field on skill detail response.
    pub frameworks: Vec<String>,

    /// Id field on skill detail response.
    pub id: String,

    /// Image field on skill detail response.
    pub image: MediaResource,

    /// Last updated field on skill detail response.
    #[serde(rename = "lastUpdated")]
    pub last_updated: String,

    /// License field on skill detail response.
    pub license: String,

    /// Name field on skill detail response.
    pub name: String,

    /// Packages field on skill detail response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub packages: Option<Vec<SkillPackageItem>>,

    /// Rating field on skill detail response.
    pub rating: f64,

    /// Screenshots field on skill detail response.
    pub screenshots: Vec<MediaResource>,

    /// Size field on skill detail response.
    pub size: String,

    /// Version field on skill detail response.
    pub version: String,
}
