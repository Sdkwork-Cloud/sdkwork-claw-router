use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseApplicationReviewResponse};

/// Course applications review result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseApplicationsReviewResult {
    /// Business response code.
    pub code: String,

    /// Data field on course applications review result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseApplicationReviewResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
