use serde::{Deserialize, Serialize};

/// Billing redeem history item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct BillingRedeemHistoryItem {
    /// Redeemed coupon amount as a canonical decimal money string.
    pub amount: String,

    /// Code field on billing redeem history item.
    pub code: String,

    /// Date field on billing redeem history item.
    pub date: String,

    /// Id field on billing redeem history item.
    pub id: i64,

    /// Status field on billing redeem history item.
    pub status: String,
}
