use serde::{Deserialize, Serialize};

/// Admin course item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseItem {
    /// Course code field on admin course item.
    #[serde(rename = "courseCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub course_code: Option<String>,

    /// Id field on admin course item.
    pub id: String,

    /// Status field on admin course item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Title field on admin course item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
}
