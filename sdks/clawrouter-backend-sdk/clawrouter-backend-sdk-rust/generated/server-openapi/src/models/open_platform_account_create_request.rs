use serde::{Deserialize, Serialize};

/// Open platform account create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformAccountCreateRequest {
    /// App id field on open platform account create request.
    #[serde(rename = "appId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// App secret field on open platform account create request.
    #[serde(rename = "appSecret")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_secret: Option<String>,

    /// Encoding aes key field on open platform account create request.
    #[serde(rename = "encodingAesKey")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub encoding_aes_key: Option<String>,

    /// Key field on open platform account create request.
    pub key: String,

    /// Name field on open platform account create request.
    pub name: String,

    /// Provider field on open platform account create request.
    pub provider: String,

    /// Token field on open platform account create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token: Option<String>,

    /// Type field on open platform account create request.
    pub r#type: String,
}
