use serde::{Deserialize, Serialize};

use crate::models::{AppCatalogResponse};

/// Apps store list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppsStoreListResult {
    /// Business response code.
    pub code: String,

    /// Data field on apps store list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AppCatalogResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
