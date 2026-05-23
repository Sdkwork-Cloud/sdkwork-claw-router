use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSkuMutationResponse};

/// Catalog skus update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogSkusUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog skus update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceProductSkuMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
