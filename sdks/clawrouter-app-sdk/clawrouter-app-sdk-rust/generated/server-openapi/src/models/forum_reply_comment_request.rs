use serde::{Deserialize, Serialize};

/// Forum reply comment request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumReplyCommentRequest {
    /// Content field on forum reply comment request.
    pub content: String,

    /// Device info field on forum reply comment request.
    #[serde(rename = "deviceInfo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_info: Option<String>,
}
