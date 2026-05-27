use serde::{Deserialize, Serialize};

/// Admin course comment item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseCommentItem {
    /// Author field on admin course comment item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub author: Option<String>,

    /// Content field on admin course comment item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,

    /// Course id field on admin course comment item.
    #[serde(rename = "courseId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub course_id: Option<String>,

    /// Created at field on admin course comment item.
    #[serde(rename = "createdAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on admin course comment item.
    pub id: String,

    /// Status field on admin course comment item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
}
