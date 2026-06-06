use serde::{Deserialize, Serialize};

use crate::models::{CourseEngagement, CourseInstructor, CourseItem, CourseOverviewSource, CourseSectionItem, MediaResource};

/// Course detail schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseDetail {
    /// Category field on course detail.
    pub category: String,

    /// Category label field on course detail.
    #[serde(rename = "categoryLabel")]
    pub category_label: String,

    /// Comment count field on course detail.
    #[serde(rename = "commentCount")]
    pub comment_count: String,

    /// Content field on course detail.
    pub content: String,

    /// Content id field on course detail.
    #[serde(rename = "contentId")]
    pub content_id: String,

    /// Course code field on course detail.
    #[serde(rename = "courseCode")]
    pub course_code: String,

    /// Currency field on course detail.
    pub currency: String,

    /// Description field on course detail.
    pub description: String,

    /// Duration text field on course detail.
    #[serde(rename = "durationText")]
    pub duration_text: String,

    /// Engagement field on course detail.
    pub engagement: CourseEngagement,

    /// External bvid field on course detail.
    #[serde(rename = "externalBvid")]
    pub external_bvid: String,

    /// Id field on course detail.
    pub id: String,

    /// Instructor field on course detail.
    pub instructor: CourseInstructor,

    /// Is collection field on course detail.
    #[serde(rename = "isCollection")]
    pub is_collection: bool,

    /// Lessons count field on course detail.
    #[serde(rename = "lessonsCount")]
    pub lessons_count: String,

    /// Level field on course detail.
    pub level: String,

    /// Level label field on course detail.
    #[serde(rename = "levelLabel")]
    pub level_label: String,

    /// Price amount field on course detail.
    #[serde(rename = "priceAmount")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_amount: Option<String>,

    /// Published at field on course detail.
    #[serde(rename = "publishedAt")]
    pub published_at: String,

    /// Rating score field on course detail.
    #[serde(rename = "ratingScore")]
    pub rating_score: f64,

    /// Related courses field on course detail.
    #[serde(rename = "relatedCourses")]
    pub related_courses: Vec<CourseItem>,

    /// Sections field on course detail.
    pub sections: Vec<CourseSectionItem>,

    /// Source field on course detail.
    pub source: CourseOverviewSource,

    /// Students count field on course detail.
    #[serde(rename = "studentsCount")]
    pub students_count: String,

    /// Tags field on course detail.
    pub tags: Vec<String>,

    /// Thumbnail field on course detail.
    pub thumbnail: MediaResource,

    /// Title field on course detail.
    pub title: String,
}
