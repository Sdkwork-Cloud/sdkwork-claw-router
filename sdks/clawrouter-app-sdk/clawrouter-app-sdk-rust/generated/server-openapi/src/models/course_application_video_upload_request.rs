use serde::{Deserialize, Serialize};

/// Course application video upload request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseApplicationVideoUploadRequest {
    /// File field on course application video upload request.
    pub file: String,

    /// File name field on course application video upload request.
    #[serde(rename = "fileName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_name: Option<String>,
}
