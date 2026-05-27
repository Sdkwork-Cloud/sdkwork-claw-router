use serde::{Deserialize, Serialize};

/// Open platform qr auth password create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformQrAuthPasswordCreateRequest {
    /// Channel field on open platform qr auth password create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel: Option<String>,

    /// Confirm password field on open platform qr auth password create request.
    #[serde(rename = "confirmPassword")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub confirm_password: Option<String>,

    /// Email field on open platform qr auth password create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,

    /// Password field on open platform qr auth password create request.
    pub password: String,

    /// Phone field on open platform qr auth password create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub phone: Option<String>,

    /// Username field on open platform qr auth password create request.
    pub username: String,

    /// Verification code field on open platform qr auth password create request.
    #[serde(rename = "verificationCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub verification_code: Option<String>,
}
