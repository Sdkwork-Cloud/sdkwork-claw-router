use serde::{Deserialize, Serialize};

/// Admin redemption record item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminRedemptionRecordItem {
    /// Amount field on admin redemption record item.
    pub amount: String,

    /// Code field on admin redemption record item.
    pub code: String,

    /// Id field on admin redemption record item.
    pub id: String,

    /// Time field on admin redemption record item.
    pub time: String,

    /// User field on admin redemption record item.
    pub user: String,

    /// User id field on admin redemption record item.
    #[serde(rename = "userId")]
    pub user_id: String,
}
