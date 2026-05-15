use serde::{Deserialize, Serialize};

/// Commerce vip daily reward status response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceVipDailyRewardStatusResponse {
    /// Available field on commerce vip daily reward status response.
    pub available: bool,

    /// Claimed today field on commerce vip daily reward status response.
    #[serde(rename = "claimedToday")]
    pub claimed_today: bool,
}
