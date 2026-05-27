use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseLessonMutationResponse};

/// Course lessons update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseLessonsUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on course lessons update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseLessonMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
