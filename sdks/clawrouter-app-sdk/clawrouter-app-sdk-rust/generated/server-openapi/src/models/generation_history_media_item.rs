use serde::{Deserialize, Serialize};

/// Generation history media item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationHistoryMediaItem {
    /// Thumb field on generation history media item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub thumb: Option<String>,

    /// Url field on generation history media item.
    pub url: String,
}
