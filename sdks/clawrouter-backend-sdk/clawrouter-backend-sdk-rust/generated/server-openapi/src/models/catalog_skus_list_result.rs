use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSkuListResponse};

/// Catalog skus list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogSkusListResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog skus list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceProductSkuListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
