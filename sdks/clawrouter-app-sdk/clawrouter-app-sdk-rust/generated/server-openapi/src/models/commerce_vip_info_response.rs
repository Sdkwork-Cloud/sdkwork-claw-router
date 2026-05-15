use serde::{Deserialize, Serialize};

/// Commerce vip info response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceVipInfoResponse {
    /// Level code field on commerce vip info response.
    #[serde(rename = "levelCode")]
    pub level_code: String,

    /// Level name field on commerce vip info response.
    #[serde(rename = "levelName")]
    pub level_name: String,

    /// Status field on commerce vip info response.
    pub status: String,
}
