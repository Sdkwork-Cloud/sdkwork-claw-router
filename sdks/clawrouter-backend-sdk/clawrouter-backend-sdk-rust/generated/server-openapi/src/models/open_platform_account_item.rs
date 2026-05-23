use serde::{Deserialize, Serialize};

/// Open platform account item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformAccountItem {
    /// Aes key ref field on open platform account item.
    #[serde(rename = "aesKeyRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub aes_key_ref: Option<String>,

    /// App id field on open platform account item.
    #[serde(rename = "appId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Created at field on open platform account item.
    #[serde(rename = "createdAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Default entry id field on open platform account item.
    #[serde(rename = "defaultEntryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_entry_id: Option<String>,

    /// Id field on open platform account item.
    pub id: String,

    /// Key field on open platform account item.
    pub key: String,

    /// Name field on open platform account item.
    pub name: String,

    /// Provider field on open platform account item.
    pub provider: String,

    /// Qr default field on open platform account item.
    #[serde(rename = "qrDefault")]
    pub qr_default: bool,

    /// Secret ref field on open platform account item.
    #[serde(rename = "secretRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Status field on open platform account item.
    pub status: String,

    /// Token ref field on open platform account item.
    #[serde(rename = "tokenRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_ref: Option<String>,

    /// Type field on open platform account item.
    pub r#type: String,

    /// Updated at field on open platform account item.
    #[serde(rename = "updatedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}
