use serde::{Deserialize, Serialize};

/// Forum comment statistics schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumCommentStatistics {
    /// Total comments field on forum comment statistics.
    #[serde(rename = "totalComments")]
    pub total_comments: String,
}
