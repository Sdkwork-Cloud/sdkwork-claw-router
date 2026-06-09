use serde::{Deserialize, Serialize};

/// Iam session create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamSessionCreateRequest {
    /// Code field on iam session create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,

    /// Device id field on iam session create request.
    #[serde(rename = "deviceId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_id: Option<String>,

    /// Device name field on iam session create request.
    #[serde(rename = "deviceName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_name: Option<String>,

    /// Device type field on iam session create request.
    #[serde(rename = "deviceType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_type: Option<String>,

    /// Email field on iam session create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,

    /// Authentication grant. Defaults to password when username and password are supplied.
    #[serde(rename = "grantType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub grant_type: Option<String>,

    /// Name field on iam session create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization code field on iam session create request.
    #[serde(rename = "organizationCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_code: Option<String>,

    /// Password field on iam session create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub password: Option<String>,

    /// Phone field on iam session create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub phone: Option<String>,

    /// Subject field on iam session create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject: Option<String>,

    /// Tenant code field on iam session create request.
    #[serde(rename = "tenantCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_code: Option<String>,

    /// Username field on iam session create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub username: Option<String>,
}
