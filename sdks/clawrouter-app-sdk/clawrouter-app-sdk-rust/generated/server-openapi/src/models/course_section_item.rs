use serde::{Deserialize, Serialize};

use crate::models::{CourseLessonItem};

/// Course section item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseSectionItem {
    /// Description field on course section item.
    pub description: String,

    /// Duration seconds field on course section item.
    #[serde(rename = "durationSeconds")]
    pub duration_seconds: String,

    /// Id field on course section item.
    pub id: String,

    /// Lesson count field on course section item.
    #[serde(rename = "lessonCount")]
    pub lesson_count: String,

    /// Lessons field on course section item.
    pub lessons: Vec<CourseLessonItem>,

    /// Section id field on course section item.
    #[serde(rename = "sectionId")]
    pub section_id: String,

    /// Section no field on course section item.
    #[serde(rename = "sectionNo")]
    pub section_no: String,

    /// Sort order field on course section item.
    #[serde(rename = "sortOrder")]
    pub sort_order: String,

    /// Title field on course section item.
    pub title: String,
}
