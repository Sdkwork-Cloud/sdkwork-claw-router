use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseRelationCollectionResponse};

/// Courses relations list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CoursesRelationsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on courses relations list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseRelationCollectionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
