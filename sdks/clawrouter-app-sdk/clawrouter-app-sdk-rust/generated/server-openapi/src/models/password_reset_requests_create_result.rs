use serde::{Deserialize, Serialize};

use crate::models::{IamPasswordResetRequestResponse};

/// Password reset requests create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PasswordResetRequestsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on password reset requests create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<IamPasswordResetRequestResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
