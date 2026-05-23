use serde::{Deserialize, Serialize};

use crate::models::{MemorySpaceItem};

/// Memory space list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MemorySpaceListResponse {
    /// Items field on memory space list response.
    pub items: Vec<MemorySpaceItem>,
}
