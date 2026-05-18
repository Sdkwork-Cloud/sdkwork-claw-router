use serde::{Deserialize, Serialize};

/// Generation agent generation config schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationAgentGenerationConfig {
    /// Aspect ratio field on generation agent generation config.
    #[serde(rename = "aspectRatio")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub aspect_ratio: Option<String>,

    /// Duration seconds field on generation agent generation config.
    #[serde(rename = "durationSeconds")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<i64>,

    /// Image count field on generation agent generation config.
    #[serde(rename = "imageCount")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub image_count: Option<i64>,

    /// Quality field on generation agent generation config.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quality: Option<String>,
}
