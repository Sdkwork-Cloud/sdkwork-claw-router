use serde::{Deserialize, Serialize};

/// Created API key metadata with masked key material.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppApiKeyItem {
    /// Created field on app api key item.
    pub created: String,

    /// Expires field on app api key item.
    pub expires: String,

    /// Group field on app api key item.
    pub group: String,

    /// Id field on app api key item.
    pub id: String,

    /// Ip limit field on app api key item.
    #[serde(rename = "ipLimit")]
    pub ip_limit: String,

    /// Masked key field on app api key item.
    #[serde(rename = "maskedKey")]
    pub masked_key: String,

    /// Modalities field on app api key item.
    pub modalities: Vec<String>,

    /// Name field on app api key item.
    pub name: String,

    /// Quota field on app api key item.
    pub quota: String,

    /// Rate field on app api key item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rate: Option<String>,

    /// Status field on app api key item.
    pub status: String,

    /// Used quota field on app api key item.
    #[serde(rename = "usedQuota")]
    pub used_quota: String,
}
