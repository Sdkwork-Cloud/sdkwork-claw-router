use serde::{Deserialize, Serialize};

use crate::models::{AppModelCatalogGroupOption, AppModelCatalogItem};

/// App model catalog response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppModelCatalogResponse {
    /// Complete admin-maintained API key group catalog for the model library sidebar. Groups are returned even when the current model filter result contains no matching model.
    pub groups: Vec<AppModelCatalogGroupOption>,

    /// Items field on app model catalog response.
    pub items: Vec<AppModelCatalogItem>,
}
