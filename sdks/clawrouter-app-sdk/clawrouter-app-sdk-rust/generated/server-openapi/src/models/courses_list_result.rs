use serde::{Deserialize, Serialize};

use crate::models::{CourseListResponse};

/// Courses list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CoursesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on courses list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CourseListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
