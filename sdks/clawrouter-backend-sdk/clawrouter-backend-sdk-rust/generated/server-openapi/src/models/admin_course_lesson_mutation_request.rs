use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Admin course lesson mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseLessonMutationRequest {
    /// Description field on admin course lesson mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Duration seconds field on admin course lesson mutation request.
    #[serde(rename = "durationSeconds")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<i64>,

    /// External bvid field on admin course lesson mutation request.
    #[serde(rename = "externalBvid")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_bvid: Option<String>,

    /// Free preview field on admin course lesson mutation request.
    #[serde(rename = "freePreview")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub free_preview: Option<bool>,

    /// Lesson no field on admin course lesson mutation request.
    #[serde(rename = "lessonNo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub lesson_no: Option<String>,

    /// Metadata field on admin course lesson mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Section id field on admin course lesson mutation request.
    #[serde(rename = "sectionId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub section_id: Option<String>,

    /// Status field on admin course lesson mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Title field on admin course lesson mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Video field on admin course lesson mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub video: Option<MediaResource>,
}
