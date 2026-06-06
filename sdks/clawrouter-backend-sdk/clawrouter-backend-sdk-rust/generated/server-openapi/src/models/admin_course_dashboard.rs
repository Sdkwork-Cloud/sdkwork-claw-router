use serde::{Deserialize, Serialize};

/// Admin course dashboard schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseDashboard {
    /// Draft courses field on admin course dashboard.
    #[serde(rename = "draftCourses")]
    pub draft_courses: String,

    /// Id field on admin course dashboard.
    pub id: String,

    /// Published courses field on admin course dashboard.
    #[serde(rename = "publishedCourses")]
    pub published_courses: String,

    /// Review queue field on admin course dashboard.
    #[serde(rename = "reviewQueue")]
    pub review_queue: String,

    /// Total comments field on admin course dashboard.
    #[serde(rename = "totalComments")]
    pub total_comments: String,

    /// Total courses field on admin course dashboard.
    #[serde(rename = "totalCourses")]
    pub total_courses: String,

    /// Total engagement field on admin course dashboard.
    #[serde(rename = "totalEngagement")]
    pub total_engagement: String,

    /// Total lessons field on admin course dashboard.
    #[serde(rename = "totalLessons")]
    pub total_lessons: String,

    /// Total students field on admin course dashboard.
    #[serde(rename = "totalStudents")]
    pub total_students: String,
}
