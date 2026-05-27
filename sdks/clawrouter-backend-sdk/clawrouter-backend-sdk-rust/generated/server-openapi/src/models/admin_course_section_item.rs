use serde::{Deserialize, Serialize};

/// Admin course section item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseSectionItem {
    /// Course id field on admin course section item.
    #[serde(rename = "courseId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub course_id: Option<String>,

    /// Id field on admin course section item.
    pub id: String,

    /// Status field on admin course section item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Title field on admin course section item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
}
