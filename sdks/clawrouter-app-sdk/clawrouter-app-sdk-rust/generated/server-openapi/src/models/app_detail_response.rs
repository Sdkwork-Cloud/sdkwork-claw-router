use serde::{Deserialize, Serialize};

use crate::models::{AppReleaseItem, MediaResource};

/// App detail response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppDetailResponse {
    /// Category field on app detail response.
    pub category: String,

    /// Description field on app detail response.
    pub description: String,

    /// Developer field on app detail response.
    pub developer: String,

    /// Downloads field on app detail response.
    pub downloads: String,

    /// Features field on app detail response.
    pub features: Vec<String>,

    /// Stable application identity from plus_app.config.standard.appKey when present; falls back to plus_app.id only when appKey is absent.
    pub id: String,

    /// Image field on app detail response.
    pub image: MediaResource,

    /// Name field on app detail response.
    pub name: String,

    /// Rating field on app detail response.
    pub rating: f64,

    /// Releases field on app detail response.
    pub releases: Vec<AppReleaseItem>,

    /// Screenshots field on app detail response.
    pub screenshots: Vec<MediaResource>,
}
