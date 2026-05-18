use serde::{Deserialize, Serialize};

/// Admin payment attempt item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminPaymentAttemptItem {
    /// Amount field on admin payment attempt item.
    pub amount: String,

    /// Created at field on admin payment attempt item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Id field on admin payment attempt item.
    pub id: String,

    /// Order no field on admin payment attempt item.
    #[serde(rename = "orderNo")]
    pub order_no: String,

    /// Provider field on admin payment attempt item.
    pub provider: String,

    /// Status field on admin payment attempt item.
    pub status: String,
}
