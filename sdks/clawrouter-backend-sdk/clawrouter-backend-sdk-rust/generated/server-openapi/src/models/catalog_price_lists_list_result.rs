use serde::{Deserialize, Serialize};

use crate::models::{CommercePriceListResponse};

/// Catalog price lists list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogPriceListsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog price lists list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePriceListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
