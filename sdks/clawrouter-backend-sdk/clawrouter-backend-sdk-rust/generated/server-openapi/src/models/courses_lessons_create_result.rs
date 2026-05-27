use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseLessonMutationResponse};

/// Courses lessons create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CoursesLessonsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on courses lessons create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseLessonMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
