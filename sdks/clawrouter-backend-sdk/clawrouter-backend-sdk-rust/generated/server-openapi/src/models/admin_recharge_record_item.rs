use serde::{Deserialize, Serialize};

/// Admin recharge record item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminRechargeRecordItem {
    /// Amount field on admin recharge record item.
    pub amount: String,

    /// Id field on admin recharge record item.
    pub id: String,

    /// Method field on admin recharge record item.
    pub method: String,

    /// Status field on admin recharge record item.
    pub status: String,

    /// Time field on admin recharge record item.
    pub time: String,

    /// Trade no field on admin recharge record item.
    #[serde(rename = "tradeNo")]
    pub trade_no: String,

    /// Usd credited field on admin recharge record item.
    pub usd_credited: String,

    /// User field on admin recharge record item.
    pub user: String,

    /// User id field on admin recharge record item.
    #[serde(rename = "userId")]
    pub user_id: String,
}
