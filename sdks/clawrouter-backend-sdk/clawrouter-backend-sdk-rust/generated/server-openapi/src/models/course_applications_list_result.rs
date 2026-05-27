use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseApplicationCollectionResponse};

/// Course applications list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseApplicationsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on course applications list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseApplicationCollectionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
