use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseSectionMutationResponse};

/// Courses sections create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CoursesSectionsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on courses sections create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseSectionMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
