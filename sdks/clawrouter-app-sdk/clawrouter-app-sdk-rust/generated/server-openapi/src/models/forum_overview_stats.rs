use serde::{Deserialize, Serialize};

/// Forum overview stats schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumOverviewStats {
    /// Member count field on forum overview stats.
    #[serde(rename = "memberCount")]
    pub member_count: String,

    /// Online members field on forum overview stats.
    #[serde(rename = "onlineMembers")]
    pub online_members: String,

    /// Total comments field on forum overview stats.
    #[serde(rename = "totalComments")]
    pub total_comments: String,

    /// Total posts field on forum overview stats.
    #[serde(rename = "totalPosts")]
    pub total_posts: String,
}
