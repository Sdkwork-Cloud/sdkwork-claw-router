use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSkuResponse};

/// Catalog skus retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogSkusRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog skus retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceProductSkuResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
