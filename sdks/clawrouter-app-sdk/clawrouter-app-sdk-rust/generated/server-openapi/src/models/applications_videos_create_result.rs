use serde::{Deserialize, Serialize};

use crate::models::{CourseApplicationVideoUploadResponse};

/// Applications videos create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ApplicationsVideosCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on applications videos create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CourseApplicationVideoUploadResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
