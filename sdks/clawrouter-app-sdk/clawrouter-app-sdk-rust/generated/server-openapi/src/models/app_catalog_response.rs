use serde::{Deserialize, Serialize};

use crate::models::{AppCatalogItem};

/// App catalog response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppCatalogResponse {
    /// Items field on app catalog response.
    pub items: Vec<AppCatalogItem>,
}
