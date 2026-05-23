use serde::{Deserialize, Serialize};

use crate::models::{MemoryEntryListResponse};

/// Entries list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct EntriesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on entries list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<MemoryEntryListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
