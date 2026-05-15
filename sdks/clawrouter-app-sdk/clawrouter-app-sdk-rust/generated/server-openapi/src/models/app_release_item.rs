use serde::{Deserialize, Serialize};

/// App release item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppReleaseItem {
    /// Download url field on app release item.
    #[serde(rename = "downloadUrl")]
    pub download_url: String,

    /// Id field on app release item.
    pub id: String,

    /// Os field on app release item.
    pub os: String,

    /// Platform type field on app release item.
    #[serde(rename = "platformType")]
    pub platform_type: String,

    /// Release date field on app release item.
    #[serde(rename = "releaseDate")]
    pub release_date: String,

    /// Size field on app release item.
    pub size: String,

    /// Version field on app release item.
    pub version: String,

    /// Whats new field on app release item.
    #[serde(rename = "whatsNew")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub whats_new: Option<String>,
}
