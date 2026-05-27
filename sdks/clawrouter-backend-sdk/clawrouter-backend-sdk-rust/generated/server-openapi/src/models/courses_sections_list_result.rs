use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseSectionCollectionResponse};

/// Courses sections list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CoursesSectionsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on courses sections list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseSectionCollectionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
