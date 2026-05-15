use serde::{Deserialize, Serialize};

/// Admin billing record item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminBillingRecordItem {
    /// Due date field on admin billing record item.
    #[serde(rename = "dueDate")]
    pub due_date: String,

    /// Id field on admin billing record item.
    pub id: String,

    /// Period field on admin billing record item.
    pub period: String,

    /// Status field on admin billing record item.
    pub status: String,

    /// Total cost field on admin billing record item.
    #[serde(rename = "totalCost")]
    pub total_cost: String,

    /// Total tokens field on admin billing record item.
    #[serde(rename = "totalTokens")]
    pub total_tokens: i64,

    /// User id field on admin billing record item.
    #[serde(rename = "userId")]
    pub user_id: String,
}
