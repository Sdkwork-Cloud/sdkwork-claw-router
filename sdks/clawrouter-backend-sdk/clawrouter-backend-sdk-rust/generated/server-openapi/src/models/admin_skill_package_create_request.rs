use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Admin skill package create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillPackageCreateRequest {
    /// Category id field on admin skill package create request.
    #[serde(rename = "categoryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Cover field on admin skill package create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover: Option<MediaResource>,

    /// Description field on admin skill package create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Enabled field on admin skill package create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,

    /// Featured field on admin skill package create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub featured: Option<bool>,

    /// Icon field on admin skill package create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<MediaResource>,

    /// Name field on admin skill package create request.
    pub name: String,

    /// Package key field on admin skill package create request.
    #[serde(rename = "packageKey")]
    pub package_key: String,

    /// Sort weight field on admin skill package create request.
    #[serde(rename = "sortWeight")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_weight: Option<i64>,

    /// Summary field on admin skill package create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tags field on admin skill package create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
}
