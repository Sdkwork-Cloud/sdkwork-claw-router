use serde::{Deserialize, Serialize};

/// Commerce wallet transaction item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceWalletTransactionItem {
    /// Amount field on commerce wallet transaction item.
    pub amount: String,

    /// Balance after field on commerce wallet transaction item.
    #[serde(rename = "balanceAfter")]
    pub balance_after: String,

    /// Business type field on commerce wallet transaction item.
    #[serde(rename = "businessType")]
    pub business_type: String,

    /// Created at field on commerce wallet transaction item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Direction field on commerce wallet transaction item.
    pub direction: String,

    /// Id field on commerce wallet transaction item.
    pub id: String,

    /// Transaction no field on commerce wallet transaction item.
    #[serde(rename = "transactionNo")]
    pub transaction_no: String,
}
