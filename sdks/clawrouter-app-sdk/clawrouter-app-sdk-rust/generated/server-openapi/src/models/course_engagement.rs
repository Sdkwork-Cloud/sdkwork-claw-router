use serde::{Deserialize, Serialize};

/// Course engagement schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseEngagement {
    /// Discussions field on course engagement.
    pub discussions: String,

    /// Likes field on course engagement.
    pub likes: String,

    /// Saves field on course engagement.
    pub saves: String,

    /// Shares field on course engagement.
    pub shares: String,

    /// Students count field on course engagement.
    #[serde(rename = "studentsCount")]
    pub students_count: String,

    /// Views field on course engagement.
    pub views: String,
}
