use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseRelationCollectionResponse};

/// Courses relations replace result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CoursesRelationsReplaceResult {
    /// Business response code.
    pub code: String,

    /// Data field on courses relations replace result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseRelationCollectionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
