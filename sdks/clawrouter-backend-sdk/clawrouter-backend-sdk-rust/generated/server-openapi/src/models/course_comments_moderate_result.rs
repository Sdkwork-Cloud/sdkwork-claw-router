use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseCommentCollectionResponse};

/// Course comments moderate result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseCommentsModerateResult {
    /// Business response code.
    pub code: String,

    /// Data field on course comments moderate result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseCommentCollectionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
