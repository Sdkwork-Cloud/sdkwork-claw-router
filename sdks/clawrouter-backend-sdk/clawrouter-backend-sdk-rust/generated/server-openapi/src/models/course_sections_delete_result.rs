use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseDeleteResponse};

/// Course sections delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseSectionsDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on course sections delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminCourseDeleteResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
