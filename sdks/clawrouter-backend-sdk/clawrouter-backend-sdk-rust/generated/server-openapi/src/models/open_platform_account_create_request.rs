use serde::{Deserialize, Serialize};

/// Open platform account create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformAccountCreateRequest {
    /// Aes key ref field on open platform account create request.
    #[serde(rename = "aesKeyRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub aes_key_ref: Option<String>,

    /// App id field on open platform account create request.
    #[serde(rename = "appId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Key field on open platform account create request.
    pub key: String,

    /// Name field on open platform account create request.
    pub name: String,

    /// Provider field on open platform account create request.
    pub provider: String,

    /// Secret ref field on open platform account create request.
    #[serde(rename = "secretRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Token ref field on open platform account create request.
    #[serde(rename = "tokenRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_ref: Option<String>,

    /// Type field on open platform account create request.
    pub r#type: String,
}
