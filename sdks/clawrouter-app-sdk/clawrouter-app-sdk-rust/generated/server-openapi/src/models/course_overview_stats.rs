use serde::{Deserialize, Serialize};

/// Course overview stats schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseOverviewStats {
    /// Total categories field on course overview stats.
    #[serde(rename = "totalCategories")]
    pub total_categories: String,

    /// Total courses field on course overview stats.
    #[serde(rename = "totalCourses")]
    pub total_courses: String,

    /// Total lessons field on course overview stats.
    #[serde(rename = "totalLessons")]
    pub total_lessons: String,

    /// Total students field on course overview stats.
    #[serde(rename = "totalStudents")]
    pub total_students: String,
}
