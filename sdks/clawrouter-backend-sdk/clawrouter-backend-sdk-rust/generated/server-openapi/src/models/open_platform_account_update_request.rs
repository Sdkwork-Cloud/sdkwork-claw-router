use serde::{Deserialize, Serialize};

/// Open platform account update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformAccountUpdateRequest {
    /// App id field on open platform account update request.
    #[serde(rename = "appId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// App secret field on open platform account update request.
    #[serde(rename = "appSecret")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_secret: Option<String>,

    /// Default entry id field on open platform account update request.
    #[serde(rename = "defaultEntryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_entry_id: Option<String>,

    /// Encoding aes key field on open platform account update request.
    #[serde(rename = "encodingAesKey")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub encoding_aes_key: Option<String>,

    /// Name field on open platform account update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Qr default field on open platform account update request.
    #[serde(rename = "qrDefault")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub qr_default: Option<bool>,

    /// Status field on open platform account update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Token field on open platform account update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token: Option<String>,
}
