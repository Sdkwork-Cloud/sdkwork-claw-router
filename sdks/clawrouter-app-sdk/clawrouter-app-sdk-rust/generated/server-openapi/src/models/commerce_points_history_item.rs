use serde::{Deserialize, Serialize};

/// Commerce points history item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePointsHistoryItem {
    /// Amount field on commerce points history item.
    pub amount: i64,

    /// Balance after field on commerce points history item.
    #[serde(rename = "balanceAfter")]
    pub balance_after: i64,

    /// Business type field on commerce points history item.
    #[serde(rename = "businessType")]
    pub business_type: String,

    /// Created at field on commerce points history item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Direction field on commerce points history item.
    pub direction: String,

    /// Id field on commerce points history item.
    pub id: String,
}
