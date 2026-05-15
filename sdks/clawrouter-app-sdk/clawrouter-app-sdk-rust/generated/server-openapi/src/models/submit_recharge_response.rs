use serde::{Deserialize, Serialize};

/// Submit recharge response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SubmitRechargeResponse {
    /// Amount field on submit recharge response.
    pub amount: String,

    /// Order no field on submit recharge response.
    #[serde(rename = "orderNo")]
    pub order_no: String,

    /// Payment method field on submit recharge response.
    #[serde(rename = "paymentMethod")]
    pub payment_method: String,

    /// Points field on submit recharge response.
    pub points: i64,

    /// Status field on submit recharge response.
    pub status: String,

    /// Success field on submit recharge response.
    pub success: bool,
}
