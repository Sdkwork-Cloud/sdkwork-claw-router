use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Updated skill category snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillCategoryItem {
    /// Code field on admin skill category item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,

    /// Description field on admin skill category item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Icon field on admin skill category item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<MediaResource>,

    /// Id field on admin skill category item.
    pub id: String,

    /// Name field on admin skill category item.
    pub name: String,

    /// Parent id field on admin skill category item.
    #[serde(rename = "parentId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Path field on admin skill category item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// Sort weight field on admin skill category item.
    #[serde(rename = "sortWeight")]
    pub sort_weight: i64,

    /// Status field on admin skill category item.
    pub status: i64,

    /// Type field on admin skill category item.
    pub r#type: i64,

    /// Visible field on admin skill category item.
    pub visible: bool,
}
