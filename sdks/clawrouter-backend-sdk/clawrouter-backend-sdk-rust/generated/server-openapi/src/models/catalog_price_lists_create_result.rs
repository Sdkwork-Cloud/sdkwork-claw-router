use serde::{Deserialize, Serialize};

use crate::models::{CommercePriceListMutationResponse};

/// Catalog price lists create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogPriceListsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog price lists create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePriceListMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
