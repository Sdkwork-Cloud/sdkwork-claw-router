use serde::{Deserialize, Serialize};

use crate::models::{IamSessionResponse, IamUserResponse};

/// Open platform qr auth session response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformQrAuthSessionResponse {
    /// Completed at field on open platform qr auth session response.
    #[serde(rename = "completedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Created at field on open platform qr auth session response.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Default account id field on open platform qr auth session response.
    #[serde(rename = "defaultAccountId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_account_id: Option<String>,

    /// Default account type field on open platform qr auth session response.
    #[serde(rename = "defaultAccountType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_account_type: Option<String>,

    /// Default entry id field on open platform qr auth session response.
    #[serde(rename = "defaultEntryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_entry_id: Option<String>,

    /// Default provider field on open platform qr auth session response.
    #[serde(rename = "defaultProvider")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_provider: Option<String>,

    /// Expires at field on open platform qr auth session response.
    #[serde(rename = "expiresAt")]
    pub expires_at: String,

    /// Fallback url field on open platform qr auth session response.
    #[serde(rename = "fallbackUrl")]
    pub fallback_url: String,

    /// Id field on open platform qr auth session response.
    pub id: String,

    /// Purpose field on open platform qr auth session response.
    pub purpose: String,

    /// Qr content field on open platform qr auth session response.
    #[serde(rename = "qrContent")]
    pub qr_content: serde_json::Value,

    /// Scanned at field on open platform qr auth session response.
    #[serde(rename = "scannedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scanned_at: Option<String>,

    /// Session field on open platform qr auth session response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub session: Option<IamSessionResponse>,

    /// Session key field on open platform qr auth session response.
    #[serde(rename = "sessionKey")]
    pub session_key: String,

    /// Status field on open platform qr auth session response.
    pub status: String,

    /// Token field on open platform qr auth session response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token: Option<IamSessionResponse>,

    /// Updated at field on open platform qr auth session response.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// User info field on open platform qr auth session response.
    #[serde(rename = "userInfo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_info: Option<IamUserResponse>,
}
