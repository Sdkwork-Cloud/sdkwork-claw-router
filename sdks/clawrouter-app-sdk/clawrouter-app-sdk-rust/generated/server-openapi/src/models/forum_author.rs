use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Forum author schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumAuthor {
    /// Avatar field on forum author.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub avatar: Option<MediaResource>,

    /// Bio field on forum author.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bio: Option<String>,

    /// Id field on forum author.
    pub id: String,

    /// Is following field on forum author.
    #[serde(rename = "isFollowing")]
    pub is_following: bool,

    /// Name field on forum author.
    pub name: String,
}
