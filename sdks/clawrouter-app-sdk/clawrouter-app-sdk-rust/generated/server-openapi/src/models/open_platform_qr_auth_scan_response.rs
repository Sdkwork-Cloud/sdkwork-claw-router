use serde::{Deserialize, Serialize};

/// Open platform qr auth scan response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformQrAuthScanResponse {
    /// Account id field on open platform qr auth scan response.
    #[serde(rename = "accountId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_id: Option<String>,

    /// Created at field on open platform qr auth scan response.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Entry id field on open platform qr auth scan response.
    #[serde(rename = "entryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub entry_id: Option<String>,

    /// External user id field on open platform qr auth scan response.
    #[serde(rename = "externalUserId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_user_id: Option<String>,

    /// Id field on open platform qr auth scan response.
    pub id: String,

    /// Ip hash field on open platform qr auth scan response.
    #[serde(rename = "ipHash")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ip_hash: Option<String>,

    /// Scan source field on open platform qr auth scan response.
    #[serde(rename = "scanSource")]
    pub scan_source: String,

    /// Session id field on open platform qr auth scan response.
    #[serde(rename = "sessionId")]
    pub session_id: String,

    /// Session key field on open platform qr auth scan response.
    #[serde(rename = "sessionKey")]
    pub session_key: String,

    /// User agent field on open platform qr auth scan response.
    #[serde(rename = "userAgent")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_agent: Option<String>,
}
