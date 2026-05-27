use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseLessonCollectionResponse};

/// Courses lessons list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CoursesLessonsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on courses lessons list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseLessonCollectionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
