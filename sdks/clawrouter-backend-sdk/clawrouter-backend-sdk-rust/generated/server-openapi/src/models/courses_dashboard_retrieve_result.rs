use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseDashboardResponse};

/// Courses dashboard retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CoursesDashboardRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on courses dashboard retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseDashboardResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
