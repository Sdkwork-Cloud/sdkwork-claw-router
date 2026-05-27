use serde::{Deserialize, Serialize};

/// Open platform qr auth scan create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformQrAuthScanCreateRequest {
    /// Account id field on open platform qr auth scan create request.
    #[serde(rename = "accountId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_id: Option<String>,

    /// Entry id field on open platform qr auth scan create request.
    #[serde(rename = "entryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub entry_id: Option<String>,

    /// External user id field on open platform qr auth scan create request.
    #[serde(rename = "externalUserId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_user_id: Option<String>,

    /// Ip hash field on open platform qr auth scan create request.
    #[serde(rename = "ipHash")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ip_hash: Option<String>,

    /// Scan source field on open platform qr auth scan create request.
    #[serde(rename = "scanSource")]
    pub scan_source: String,

    /// User agent field on open platform qr auth scan create request.
    #[serde(rename = "userAgent")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_agent: Option<String>,
}
