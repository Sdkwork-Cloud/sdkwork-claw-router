use serde::{Deserialize, Serialize};

use crate::models::{GenerationAgentMeteringEvent};

/// Generation agent usage summary schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationAgentUsageSummary {
    /// Cached tokens field on generation agent usage summary.
    #[serde(rename = "cachedTokens")]
    pub cached_tokens: i64,

    /// Completion tokens field on generation agent usage summary.
    #[serde(rename = "completionTokens")]
    pub completion_tokens: i64,

    /// Events field on generation agent usage summary.
    pub events: Vec<GenerationAgentMeteringEvent>,

    /// Image count field on generation agent usage summary.
    #[serde(rename = "imageCount")]
    pub image_count: i64,

    /// Prompt tokens field on generation agent usage summary.
    #[serde(rename = "promptTokens")]
    pub prompt_tokens: i64,

    /// Total tokens field on generation agent usage summary.
    #[serde(rename = "totalTokens")]
    pub total_tokens: i64,

    /// Video seconds field on generation agent usage summary.
    #[serde(rename = "videoSeconds")]
    pub video_seconds: String,
}
