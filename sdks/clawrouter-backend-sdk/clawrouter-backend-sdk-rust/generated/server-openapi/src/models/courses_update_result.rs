use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseMutationResponse};

/// Courses update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CoursesUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on courses update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
