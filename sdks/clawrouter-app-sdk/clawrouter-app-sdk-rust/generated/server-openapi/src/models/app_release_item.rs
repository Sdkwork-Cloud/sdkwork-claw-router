use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// App release item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppReleaseItem {
    /// Artifact field on app release item.
    pub artifact: MediaResource,

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
