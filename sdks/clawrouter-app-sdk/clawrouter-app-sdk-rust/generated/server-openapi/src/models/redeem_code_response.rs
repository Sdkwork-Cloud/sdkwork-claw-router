use serde::{Deserialize, Serialize};

/// Redeem code response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RedeemCodeResponse {
    /// Redeemed coupon amount as a canonical decimal money string.
    pub amount: String,

    /// Balance field on redeem code response.
    pub balance: i64,

    /// Credited points field on redeem code response.
    #[serde(rename = "creditedPoints")]
    pub credited_points: i64,

    /// Message field on redeem code response.
    pub message: String,
}
