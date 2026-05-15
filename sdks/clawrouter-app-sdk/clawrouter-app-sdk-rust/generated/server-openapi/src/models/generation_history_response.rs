use serde::{Deserialize, Serialize};

use crate::models::{GenerationHistoryItem};

/// Generation history response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationHistoryResponse {
    /// Items field on generation history response.
    pub items: Vec<GenerationHistoryItem>,
}
