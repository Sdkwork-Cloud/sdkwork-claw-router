use serde::{Deserialize, Serialize};

/// Admin course relation item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseRelationItem {
    /// Course id field on admin course relation item.
    #[serde(rename = "courseId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub course_id: Option<String>,

    /// Id field on admin course relation item.
    pub id: String,

    /// Related course id field on admin course relation item.
    #[serde(rename = "relatedCourseId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub related_course_id: Option<String>,

    /// Relation type field on admin course relation item.
    #[serde(rename = "relationType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub relation_type: Option<String>,

    /// Sort order field on admin course relation item.
    #[serde(rename = "sortOrder")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on admin course relation item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
}
