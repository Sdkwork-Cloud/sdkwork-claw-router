use serde::{Deserialize, Serialize};

/// Forum overview stats schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumOverviewStats {
    /// Member count field on forum overview stats.
    #[serde(rename = "memberCount")]
    pub member_count: i64,

    /// Online members field on forum overview stats.
    #[serde(rename = "onlineMembers")]
    pub online_members: i64,

    /// Total comments field on forum overview stats.
    #[serde(rename = "totalComments")]
    pub total_comments: i64,

    /// Total posts field on forum overview stats.
    #[serde(rename = "totalPosts")]
    pub total_posts: i64,
}
