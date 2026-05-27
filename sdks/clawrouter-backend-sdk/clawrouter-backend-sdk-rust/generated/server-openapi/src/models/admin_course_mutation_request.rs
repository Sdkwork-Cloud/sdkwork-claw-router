use serde::{Deserialize, Serialize};

/// Admin course mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseMutationRequest {
    /// Category field on admin course mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,

    /// Course code field on admin course mutation request.
    #[serde(rename = "courseCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub course_code: Option<String>,

    /// Description field on admin course mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Instructor snapshot field on admin course mutation request.
    #[serde(rename = "instructorSnapshot")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub instructor_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Level field on admin course mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub level: Option<String>,

    /// Metadata field on admin course mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Status field on admin course mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Thumbnail url field on admin course mutation request.
    #[serde(rename = "thumbnailUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub thumbnail_url: Option<String>,

    /// Title field on admin course mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
}
