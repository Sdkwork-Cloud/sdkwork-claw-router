use serde::{Deserialize, Serialize};

/// Admin course engagement item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseEngagementItem {
    /// Count field on admin course engagement item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub count: Option<i64>,

    /// Course id field on admin course engagement item.
    #[serde(rename = "courseId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub course_id: Option<String>,

    /// Id field on admin course engagement item.
    pub id: String,

    /// Reaction type field on admin course engagement item.
    #[serde(rename = "reactionType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reaction_type: Option<String>,

    /// Reaction value field on admin course engagement item.
    #[serde(rename = "reactionValue")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reaction_value: Option<String>,

    /// Status field on admin course engagement item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
}
