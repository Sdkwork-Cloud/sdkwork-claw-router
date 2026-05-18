use serde::{Deserialize, Serialize};

use crate::models::{GenerationAgentGenerationConfig, GenerationAgentReferenceImageInput};

/// Generation agent run create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationAgentRunCreateRequest {
    /// Generation config field on generation agent run create request.
    #[serde(rename = "generationConfig")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub generation_config: Option<GenerationAgentGenerationConfig>,

    /// Prompt field on generation agent run create request.
    pub prompt: String,

    /// Reference images field on generation agent run create request.
    #[serde(rename = "referenceImages")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reference_images: Option<Vec<GenerationAgentReferenceImageInput>>,

    /// Selected model field on generation agent run create request.
    #[serde(rename = "selectedModel")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub selected_model: Option<String>,

    /// Target type field on generation agent run create request.
    #[serde(rename = "targetType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_type: Option<String>,
}
