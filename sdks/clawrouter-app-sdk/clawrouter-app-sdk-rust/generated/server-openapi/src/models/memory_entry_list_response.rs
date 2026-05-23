use serde::{Deserialize, Serialize};

use crate::models::{MemoryEntryItem};

/// Memory entry list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MemoryEntryListResponse {
    /// Items field on memory entry list response.
    pub items: Vec<MemoryEntryItem>,
}
