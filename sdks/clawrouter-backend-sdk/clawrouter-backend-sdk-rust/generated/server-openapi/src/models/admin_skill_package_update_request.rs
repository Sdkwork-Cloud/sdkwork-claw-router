use serde::{Deserialize, Serialize};

/// Admin skill package update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillPackageUpdateRequest {
    /// Category id field on admin skill package update request.
    #[serde(rename = "categoryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Cover image field on admin skill package update request.
    #[serde(rename = "coverImage")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover_image: Option<String>,

    /// Description field on admin skill package update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Enabled field on admin skill package update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,

    /// Featured field on admin skill package update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub featured: Option<bool>,

    /// Icon field on admin skill package update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,

    /// Name field on admin skill package update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Package key field on admin skill package update request.
    #[serde(rename = "packageKey")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_key: Option<String>,

    /// Sort weight field on admin skill package update request.
    #[serde(rename = "sortWeight")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_weight: Option<i64>,

    /// Summary field on admin skill package update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tags field on admin skill package update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
}
