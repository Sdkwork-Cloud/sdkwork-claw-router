use serde::{Deserialize, Serialize};

use crate::models::{MemorySpaceItem};

/// Spaces retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SpacesRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on spaces retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<MemorySpaceItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
