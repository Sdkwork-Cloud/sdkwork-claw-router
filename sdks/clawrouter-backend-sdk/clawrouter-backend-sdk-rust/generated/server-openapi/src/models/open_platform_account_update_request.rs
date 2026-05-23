use serde::{Deserialize, Serialize};

/// Open platform account update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformAccountUpdateRequest {
    /// Aes key ref field on open platform account update request.
    #[serde(rename = "aesKeyRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub aes_key_ref: Option<String>,

    /// App id field on open platform account update request.
    #[serde(rename = "appId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Default entry id field on open platform account update request.
    #[serde(rename = "defaultEntryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_entry_id: Option<String>,

    /// Name field on open platform account update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Qr default field on open platform account update request.
    #[serde(rename = "qrDefault")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub qr_default: Option<bool>,

    /// Secret ref field on open platform account update request.
    #[serde(rename = "secretRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Status field on open platform account update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Token ref field on open platform account update request.
    #[serde(rename = "tokenRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_ref: Option<String>,
}
