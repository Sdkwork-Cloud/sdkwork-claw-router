use serde::{Deserialize, Serialize};

use crate::models::{ForumCommunityLink, ForumOverviewSource, ForumOverviewStats};

/// Forum overview response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumOverviewResponse {
    /// Community links field on forum overview response.
    #[serde(rename = "communityLinks")]
    pub community_links: Vec<ForumCommunityLink>,

    /// Source field on forum overview response.
    pub source: ForumOverviewSource,

    /// Stats field on forum overview response.
    pub stats: ForumOverviewStats,
}
