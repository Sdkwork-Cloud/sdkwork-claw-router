use serde::{Deserialize, Serialize};

use crate::models::{AppDetailResponse};

/// Apps store retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppsStoreRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on apps store retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AppDetailResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
