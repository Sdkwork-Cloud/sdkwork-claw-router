use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Forum community link schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ForumCommunityLink {
    /// Id field on forum community link.
    pub id: String,

    /// Label field on forum community link.
    pub label: String,

    /// Qr code field on forum community link.
    #[serde(rename = "qrCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub qr_code: Option<MediaResource>,

    /// Tone field on forum community link.
    pub tone: String,

    /// Url field on forum community link.
    pub url: String,
}
