use serde::{Deserialize, Serialize};

/// Admin course lesson item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseLessonItem {
    /// Course id field on admin course lesson item.
    #[serde(rename = "courseId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub course_id: Option<String>,

    /// Id field on admin course lesson item.
    pub id: String,

    /// Section id field on admin course lesson item.
    #[serde(rename = "sectionId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub section_id: Option<String>,

    /// Status field on admin course lesson item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Title field on admin course lesson item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
}
