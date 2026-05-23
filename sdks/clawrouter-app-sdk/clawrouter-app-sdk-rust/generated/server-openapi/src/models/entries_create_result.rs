use serde::{Deserialize, Serialize};

use crate::models::{MemoryEntryResponse};

/// Entries create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct EntriesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on entries create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<MemoryEntryResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
