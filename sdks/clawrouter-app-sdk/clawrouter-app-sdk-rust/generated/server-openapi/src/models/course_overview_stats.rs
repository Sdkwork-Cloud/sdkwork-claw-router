use serde::{Deserialize, Serialize};

/// Course overview stats schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseOverviewStats {
    /// Total categories field on course overview stats.
    #[serde(rename = "totalCategories")]
    pub total_categories: i64,

    /// Total courses field on course overview stats.
    #[serde(rename = "totalCourses")]
    pub total_courses: i64,

    /// Total lessons field on course overview stats.
    #[serde(rename = "totalLessons")]
    pub total_lessons: i64,

    /// Total students field on course overview stats.
    #[serde(rename = "totalStudents")]
    pub total_students: i64,
}
