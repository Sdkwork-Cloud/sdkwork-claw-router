use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductAttributeListResponse};

/// Catalog attributes list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CatalogAttributesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on catalog attributes list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceProductAttributeListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
