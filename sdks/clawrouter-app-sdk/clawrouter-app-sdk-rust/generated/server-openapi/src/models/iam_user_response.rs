use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Iam user response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamUserResponse {
    /// Avatar field on iam user response.
    pub avatar: MediaResource,

    /// Display name field on iam user response.
    #[serde(rename = "displayName")]
    pub display_name: String,

    /// Email field on iam user response.
    pub email: String,

    /// Id field on iam user response.
    pub id: String,

    /// Is verified field on iam user response.
    #[serde(rename = "isVerified")]
    pub is_verified: bool,

    /// Language field on iam user response.
    pub language: String,

    /// Last login field on iam user response.
    #[serde(rename = "lastLogin")]
    pub last_login: String,

    /// Masked client IP address from the latest login event.
    #[serde(rename = "lastLoginIp")]
    pub last_login_ip: String,

    /// Password last changed field on iam user response.
    #[serde(rename = "passwordLastChanged")]
    pub password_last_changed: String,

    /// Safe display phone value, empty when unavailable.
    pub phone: String,

    /// Registered at field on iam user response.
    #[serde(rename = "registeredAt")]
    pub registered_at: String,

    /// Status field on iam user response.
    pub status: String,

    /// Safe OAuth provider binding summary without provider subject IDs or tokens.
    #[serde(rename = "thirdPartyBound")]
    pub third_party_bound: String,

    /// Two factor enabled field on iam user response.
    #[serde(rename = "twoFactorEnabled")]
    pub two_factor_enabled: bool,

    /// Username field on iam user response.
    pub username: String,
}
