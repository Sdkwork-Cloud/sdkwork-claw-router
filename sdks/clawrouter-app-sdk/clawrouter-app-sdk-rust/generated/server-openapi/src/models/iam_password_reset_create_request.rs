use serde::{Deserialize, Serialize};

/// Iam password reset create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamPasswordResetCreateRequest {
    /// Account field on iam password reset create request.
    pub account: String,

    /// Code field on iam password reset create request.
    pub code: String,

    /// Confirm password field on iam password reset create request.
    #[serde(rename = "confirmPassword")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub confirm_password: Option<String>,

    /// New password field on iam password reset create request.
    #[serde(rename = "newPassword")]
    pub new_password: String,
}
