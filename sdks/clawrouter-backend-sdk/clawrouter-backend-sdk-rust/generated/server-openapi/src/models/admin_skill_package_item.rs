use serde::{Deserialize, Serialize};

/// Enabled skill package snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillPackageItem {
    /// Category id field on admin skill package item.
    #[serde(rename = "categoryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Cover image field on admin skill package item.
    #[serde(rename = "coverImage")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover_image: Option<String>,

    /// Created at field on admin skill package item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Description field on admin skill package item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Enabled field on admin skill package item.
    pub enabled: bool,

    /// Featured field on admin skill package item.
    pub featured: bool,

    /// Icon field on admin skill package item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,

    /// Id field on admin skill package item.
    pub id: String,

    /// Latest published at field on admin skill package item.
    #[serde(rename = "latestPublishedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latest_published_at: Option<String>,

    /// Name field on admin skill package item.
    pub name: String,

    /// Package key field on admin skill package item.
    #[serde(rename = "packageKey")]
    pub package_key: String,

    /// Sort weight field on admin skill package item.
    #[serde(rename = "sortWeight")]
    pub sort_weight: i64,

    /// Summary field on admin skill package item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tags field on admin skill package item.
    pub tags: Vec<String>,

    /// Updated at field on admin skill package item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
