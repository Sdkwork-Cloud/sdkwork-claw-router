use serde::{Deserialize, Serialize};

/// Billing recharge history item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct BillingRechargeHistoryItem {
    /// Recharge payment amount as a canonical decimal money string.
    pub amount: String,

    /// Date field on billing recharge history item.
    pub date: String,

    /// Id field on billing recharge history item.
    pub id: i64,

    /// Method field on billing recharge history item.
    pub method: String,

    /// Order no field on billing recharge history item.
    #[serde(rename = "orderNo")]
    pub order_no: String,

    /// Status field on billing recharge history item.
    pub status: String,
}
