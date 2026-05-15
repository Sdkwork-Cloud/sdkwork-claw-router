use serde::{Deserialize, Serialize};

/// Admin transaction record item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminTransactionRecordItem {
    /// Amount field on admin transaction record item.
    pub amount: String,

    /// Balance field on admin transaction record item.
    pub balance: String,

    /// Description field on admin transaction record item.
    pub description: String,

    /// Id field on admin transaction record item.
    pub id: String,

    /// Status field on admin transaction record item.
    pub status: String,

    /// Time field on admin transaction record item.
    pub time: String,

    /// Type field on admin transaction record item.
    pub r#type: String,

    /// User id field on admin transaction record item.
    #[serde(rename = "userId")]
    pub user_id: String,
}
