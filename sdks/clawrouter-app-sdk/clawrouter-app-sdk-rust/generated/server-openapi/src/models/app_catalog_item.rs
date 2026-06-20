use serde::{Deserialize, Serialize};

use crate::models::{AppReleaseItem, MediaResource};

/// App catalog item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppCatalogItem {
    /// Category field on app catalog item.
    pub category: String,

    /// Description field on app catalog item.
    pub description: String,

    /// Developer field on app catalog item.
    pub developer: String,

    /// Downloads field on app catalog item.
    pub downloads: String,

    /// Features field on app catalog item.
    pub features: Vec<String>,

    /// Stable application identity from platform_app.config.standard.appKey when present; falls back to platform_app.id only when appKey is absent.
    pub id: String,

    /// Image field on app catalog item.
    pub image: MediaResource,

    /// Name field on app catalog item.
    pub name: String,

    /// Rating field on app catalog item.
    pub rating: f64,

    /// Releases field on app catalog item.
    pub releases: Vec<AppReleaseItem>,

    /// Screenshots field on app catalog item.
    pub screenshots: Vec<MediaResource>,
}
