use serde::{Deserialize, Serialize};

use crate::models::{MemoryEntryItem};

/// Memory entry response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MemoryEntryResponse {
    /// Item field on memory entry response.
    pub item: MemoryEntryItem,
}
