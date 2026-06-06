use serde::{Deserialize, Serialize};

/// Forum create comment request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumCreateCommentRequest {
    /// Content field on forum create comment request.
    pub content: String,

    /// Content id field on forum create comment request.
    #[serde(rename = "contentId")]
    pub content_id: String,

    /// Content type field on forum create comment request.
    #[serde(rename = "contentType")]
    pub content_type: String,

    /// Device info field on forum create comment request.
    #[serde(rename = "deviceInfo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_info: Option<String>,
}
