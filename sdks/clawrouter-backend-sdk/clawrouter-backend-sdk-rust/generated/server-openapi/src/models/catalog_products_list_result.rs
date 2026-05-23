use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSpuListResponse};

/// Catalog products list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogProductsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog products list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceProductSpuListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
