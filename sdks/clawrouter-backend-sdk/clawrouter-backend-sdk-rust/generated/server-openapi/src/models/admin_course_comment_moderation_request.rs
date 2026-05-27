use serde::{Deserialize, Serialize};

/// Admin course comment moderation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseCommentModerationRequest {
    /// Moderation note field on admin course comment moderation request.
    #[serde(rename = "moderationNote")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub moderation_note: Option<String>,

    /// Status field on admin course comment moderation request.
    pub status: String,
}
