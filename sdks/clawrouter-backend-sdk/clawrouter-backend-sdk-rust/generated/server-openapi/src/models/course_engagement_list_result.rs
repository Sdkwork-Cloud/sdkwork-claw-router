use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseEngagementCollectionResponse};

/// Course engagement list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseEngagementListResult {
    /// Business response code.
    pub code: String,

    /// Data field on course engagement list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseEngagementCollectionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
