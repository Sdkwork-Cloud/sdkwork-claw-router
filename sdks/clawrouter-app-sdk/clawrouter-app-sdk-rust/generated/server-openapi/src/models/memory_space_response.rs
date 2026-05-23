use serde::{Deserialize, Serialize};

use crate::models::{MemorySpaceItem};

/// Memory space response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MemorySpaceResponse {
    /// Item field on memory space response.
    pub item: MemorySpaceItem,
}
