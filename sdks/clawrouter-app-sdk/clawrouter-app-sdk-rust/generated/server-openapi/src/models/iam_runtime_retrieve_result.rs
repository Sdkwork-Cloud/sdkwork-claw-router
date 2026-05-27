use serde::{Deserialize, Serialize};

use crate::models::{AuthRuntimeSettingsResponse};

/// Iam runtime retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamRuntimeRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on iam runtime retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AuthRuntimeSettingsResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
