use serde::{Deserialize, Serialize};

use crate::models::{AppCatalogItem};

/// App catalog response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppCatalogResponse {
    /// Has next page field on app catalog response.
    #[serde(rename = "hasNextPage")]
    pub has_next_page: bool,

    /// Items field on app catalog response.
    pub items: Vec<AppCatalogItem>,

    /// Page field on app catalog response.
    pub page: i64,

    /// Page size field on app catalog response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on app catalog response.
    pub total: i64,
}
