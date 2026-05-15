use serde::{Deserialize, Serialize};

/// Course engagement schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseEngagement {
    /// Discussions field on course engagement.
    pub discussions: i64,

    /// Likes field on course engagement.
    pub likes: i64,

    /// Saves field on course engagement.
    pub saves: i64,

    /// Shares field on course engagement.
    pub shares: i64,

    /// Students count field on course engagement.
    #[serde(rename = "studentsCount")]
    pub students_count: i64,

    /// Views field on course engagement.
    pub views: i64,
}
