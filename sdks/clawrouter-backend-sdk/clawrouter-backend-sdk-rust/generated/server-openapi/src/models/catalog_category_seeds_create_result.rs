use serde::{Deserialize, Serialize};

use crate::models::{CommerceCategorySeedInitializeResponse};

/// Catalog category seeds create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogCategorySeedsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog category seeds create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceCategorySeedInitializeResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
