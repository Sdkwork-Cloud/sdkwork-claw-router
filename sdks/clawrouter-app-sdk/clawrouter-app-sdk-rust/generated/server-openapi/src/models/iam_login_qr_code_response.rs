use serde::{Deserialize, Serialize};

/// Iam login qr code response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamLoginQrCodeResponse {
    /// Description field on iam login qr code response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Expire time field on iam login qr code response.
    #[serde(rename = "expireTime")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expire_time: Option<i64>,

    /// Qr content field on iam login qr code response.
    #[serde(rename = "qrContent")]
    pub qr_content: String,

    /// Qr key field on iam login qr code response.
    #[serde(rename = "qrKey")]
    pub qr_key: String,

    /// Qr url field on iam login qr code response.
    #[serde(rename = "qrUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub qr_url: Option<String>,

    /// Title field on iam login qr code response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Type field on iam login qr code response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub r#type: Option<String>,
}
