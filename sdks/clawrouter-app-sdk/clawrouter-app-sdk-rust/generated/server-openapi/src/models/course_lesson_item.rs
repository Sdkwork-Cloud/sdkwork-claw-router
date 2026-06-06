use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Course lesson item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseLessonItem {
    /// Content field on course lesson item.
    pub content: String,

    /// Description field on course lesson item.
    pub description: String,

    /// Duration seconds field on course lesson item.
    #[serde(rename = "durationSeconds")]
    pub duration_seconds: String,

    /// Duration text field on course lesson item.
    #[serde(rename = "durationText")]
    pub duration_text: String,

    /// External bvid field on course lesson item.
    #[serde(rename = "externalBvid")]
    pub external_bvid: String,

    /// Free preview field on course lesson item.
    #[serde(rename = "freePreview")]
    pub free_preview: bool,

    /// Id field on course lesson item.
    pub id: String,

    /// Lesson id field on course lesson item.
    #[serde(rename = "lessonId")]
    pub lesson_id: String,

    /// Lesson no field on course lesson item.
    #[serde(rename = "lessonNo")]
    pub lesson_no: String,

    /// Number field on course lesson item.
    pub number: String,

    /// Sort order field on course lesson item.
    #[serde(rename = "sortOrder")]
    pub sort_order: String,

    /// Source provider field on course lesson item.
    #[serde(rename = "sourceProvider")]
    pub source_provider: String,

    /// Title field on course lesson item.
    pub title: String,

    /// Video field on course lesson item.
    pub video: MediaResource,
}
