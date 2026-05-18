use serde::{Deserialize, Serialize};

/// Generation agent reference image input schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationAgentReferenceImageInput {
    /// Mime type field on generation agent reference image input.
    #[serde(rename = "mimeType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mime_type: Option<String>,

    /// Name field on generation agent reference image input.
    pub name: String,

    /// Size bytes field on generation agent reference image input.
    #[serde(rename = "sizeBytes")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub size_bytes: Option<i64>,
}
