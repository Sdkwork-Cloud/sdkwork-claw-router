use serde::{Deserialize, Serialize};

use crate::models::{MemorySpaceListResponse};

/// Spaces list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SpacesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on spaces list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<MemorySpaceListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
