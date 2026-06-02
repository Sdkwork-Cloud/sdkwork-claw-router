use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Course instructor schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseInstructor {
    /// Avatar field on course instructor.
    pub avatar: MediaResource,

    /// Bio field on course instructor.
    pub bio: String,

    /// Name field on course instructor.
    pub name: String,

    /// Title field on course instructor.
    pub title: String,
}
