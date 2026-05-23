use serde::{Deserialize, Serialize};

/// Admin app category create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppCategoryCreateRequest {
    /// Optional stable category code.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,

    /// Optional category description.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Optional icon URL or asset path.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,

    /// App store category display name.
    pub name: String,

    /// Parent id field on admin app category create request.
    #[serde(rename = "parentId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Path field on admin app category create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// Sort weight field on admin app category create request.
    #[serde(rename = "sortWeight")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_weight: Option<i64>,

    /// Status field on admin app category create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<i64>,

    /// Visible field on admin app category create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub visible: Option<bool>,
}
