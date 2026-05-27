use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSpuDetailResponse};

/// Catalog products retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogProductsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog products retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceProductSpuDetailResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
