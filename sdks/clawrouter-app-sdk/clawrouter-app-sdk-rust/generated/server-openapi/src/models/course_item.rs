use serde::{Deserialize, Serialize};

use crate::models::{CourseEngagement, CourseInstructor, MediaResource};

/// Course item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseItem {
    /// Category field on course item.
    pub category: String,

    /// Category label field on course item.
    #[serde(rename = "categoryLabel")]
    pub category_label: String,

    /// Comment count field on course item.
    #[serde(rename = "commentCount")]
    pub comment_count: i64,

    /// Content field on course item.
    pub content: String,

    /// Content id field on course item.
    #[serde(rename = "contentId")]
    pub content_id: i64,

    /// Course code field on course item.
    #[serde(rename = "courseCode")]
    pub course_code: String,

    /// Currency field on course item.
    pub currency: String,

    /// Description field on course item.
    pub description: String,

    /// Duration text field on course item.
    #[serde(rename = "durationText")]
    pub duration_text: String,

    /// Engagement field on course item.
    pub engagement: CourseEngagement,

    /// External bvid field on course item.
    #[serde(rename = "externalBvid")]
    pub external_bvid: String,

    /// Id field on course item.
    pub id: String,

    /// Instructor field on course item.
    pub instructor: CourseInstructor,

    /// Is collection field on course item.
    #[serde(rename = "isCollection")]
    pub is_collection: bool,

    /// Lessons count field on course item.
    #[serde(rename = "lessonsCount")]
    pub lessons_count: i64,

    /// Level field on course item.
    pub level: i64,

    /// Level label field on course item.
    #[serde(rename = "levelLabel")]
    pub level_label: String,

    /// Price amount field on course item.
    #[serde(rename = "priceAmount")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_amount: Option<String>,

    /// Published at field on course item.
    #[serde(rename = "publishedAt")]
    pub published_at: String,

    /// Rating score field on course item.
    #[serde(rename = "ratingScore")]
    pub rating_score: f64,

    /// Students count field on course item.
    #[serde(rename = "studentsCount")]
    pub students_count: i64,

    /// Tags field on course item.
    pub tags: Vec<String>,

    /// Thumbnail field on course item.
    pub thumbnail: MediaResource,

    /// Title field on course item.
    pub title: String,
}
