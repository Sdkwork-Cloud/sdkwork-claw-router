use serde::{Deserialize, Serialize};

use crate::models::{AppModelCatalogItem};

/// App model catalog response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppModelCatalogResponse {
    /// Items field on app model catalog response.
    pub items: Vec<AppModelCatalogItem>,
}
