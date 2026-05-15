use serde::{Deserialize, Serialize};

use crate::models::{CourseApplicationCreateResponse};

/// Applications create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ApplicationsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on applications create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CourseApplicationCreateResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
