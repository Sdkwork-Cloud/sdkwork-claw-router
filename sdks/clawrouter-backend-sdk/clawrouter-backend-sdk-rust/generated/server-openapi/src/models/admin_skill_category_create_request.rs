use serde::{Deserialize, Serialize};

/// Admin skill category create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillCategoryCreateRequest {
    /// Optional stable category code.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,

    /// Optional category description.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Optional icon URL or asset path.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,

    /// Skill category display name.
    pub name: String,

    /// Parent id field on admin skill category create request.
    #[serde(rename = "parentId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Path field on admin skill category create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// Sort weight field on admin skill category create request.
    #[serde(rename = "sortWeight")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_weight: Option<i64>,

    /// Status field on admin skill category create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<i64>,

    /// Type field on admin skill category create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub r#type: Option<i64>,

    /// Visible field on admin skill category create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub visible: Option<bool>,
}
