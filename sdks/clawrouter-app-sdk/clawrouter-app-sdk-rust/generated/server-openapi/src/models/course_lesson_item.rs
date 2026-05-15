use serde::{Deserialize, Serialize};

/// Course lesson item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseLessonItem {
    /// Content field on course lesson item.
    pub content: String,

    /// Description field on course lesson item.
    pub description: String,

    /// Duration seconds field on course lesson item.
    #[serde(rename = "durationSeconds")]
    pub duration_seconds: i64,

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
    pub lesson_id: i64,

    /// Lesson no field on course lesson item.
    #[serde(rename = "lessonNo")]
    pub lesson_no: i64,

    /// Number field on course lesson item.
    pub number: i64,

    /// Sort order field on course lesson item.
    #[serde(rename = "sortOrder")]
    pub sort_order: i64,

    /// Source provider field on course lesson item.
    #[serde(rename = "sourceProvider")]
    pub source_provider: String,

    /// Title field on course lesson item.
    pub title: String,

    /// Video url field on course lesson item.
    #[serde(rename = "videoUrl")]
    pub video_url: String,
}
