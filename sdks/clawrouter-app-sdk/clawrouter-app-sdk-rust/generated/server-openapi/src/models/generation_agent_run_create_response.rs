use serde::{Deserialize, Serialize};

use crate::models::{GenerationAgentMeteringEvent, GenerationAgentRunSnapshot, GenerationAgentRunStepSnapshot, GenerationAgentSnapshot, GenerationAgentUsageSummary, GenerationHistoryItem};

/// Generation agent run create response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationAgentRunCreateResponse {
    /// Agent field on generation agent run create response.
    pub agent: GenerationAgentSnapshot,

    /// Item field on generation agent run create response.
    pub item: GenerationHistoryItem,

    /// Metering events field on generation agent run create response.
    #[serde(rename = "meteringEvents")]
    pub metering_events: Vec<GenerationAgentMeteringEvent>,

    /// Run field on generation agent run create response.
    pub run: GenerationAgentRunSnapshot,

    /// Status field on generation agent run create response.
    pub status: String,

    /// Steps field on generation agent run create response.
    pub steps: Vec<GenerationAgentRunStepSnapshot>,

    /// Target type field on generation agent run create response.
    #[serde(rename = "targetType")]
    pub target_type: String,

    /// Usage field on generation agent run create response.
    pub usage: GenerationAgentUsageSummary,
}
