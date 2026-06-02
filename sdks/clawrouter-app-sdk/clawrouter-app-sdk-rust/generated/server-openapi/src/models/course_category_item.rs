use serde::{Deserialize, Serialize};

/// Course category item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseCategoryItem {
    /// Code field on course category item.
    pub code: String,

    /// Course count field on course category item.
    #[serde(rename = "courseCount")]
    pub course_count: i64,

    /// Description field on course category item.
    pub description: String,

    /// Icon key field on course category item.
    #[serde(rename = "iconKey")]
    pub icon_key: String,

    /// Id field on course category item.
    pub id: String,

    /// Label field on course category item.
    pub label: String,

    /// Name field on course category item.
    pub name: String,

    /// Sort weight field on course category item.
    #[serde(rename = "sortWeight")]
    pub sort_weight: i64,
}
