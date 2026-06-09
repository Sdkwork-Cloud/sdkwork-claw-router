use serde::{Deserialize, Serialize};

/// Iam registration create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamRegistrationCreateRequest {
    /// Channel field on iam registration create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel: Option<String>,

    /// Confirm password field on iam registration create request.
    #[serde(rename = "confirmPassword")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub confirm_password: Option<String>,

    /// Email field on iam registration create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,

    /// Organization code field on iam registration create request.
    #[serde(rename = "organizationCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_code: Option<String>,

    /// Password field on iam registration create request.
    pub password: String,

    /// Phone field on iam registration create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub phone: Option<String>,

    /// Tenant code field on iam registration create request.
    #[serde(rename = "tenantCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_code: Option<String>,

    /// Username field on iam registration create request.
    pub username: String,

    /// Verification code field on iam registration create request.
    #[serde(rename = "verificationCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub verification_code: Option<String>,
}
