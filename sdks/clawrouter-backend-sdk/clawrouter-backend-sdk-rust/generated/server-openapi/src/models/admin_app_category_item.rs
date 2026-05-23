use serde::{Deserialize, Serialize};

/// Updated app store category snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppCategoryItem {
    /// Code field on admin app category item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,

    /// Description field on admin app category item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Icon field on admin app category item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,

    /// Id field on admin app category item.
    pub id: String,

    /// Name field on admin app category item.
    pub name: String,

    /// Parent id field on admin app category item.
    #[serde(rename = "parentId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Path field on admin app category item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// Sort weight field on admin app category item.
    #[serde(rename = "sortWeight")]
    pub sort_weight: i64,

    /// Status field on admin app category item.
    pub status: i64,

    /// Type field on admin app category item.
    pub r#type: i64,

    /// Visible field on admin app category item.
    pub visible: bool,
}
