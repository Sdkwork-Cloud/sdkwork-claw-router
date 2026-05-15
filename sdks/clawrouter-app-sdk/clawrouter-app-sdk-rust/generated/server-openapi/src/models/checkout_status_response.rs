use serde::{Deserialize, Serialize};

/// Checkout status response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CheckoutStatusResponse {
    /// Checkout amount as a canonical decimal money string.
    pub amount: String,

    /// Created at field on checkout status response.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Expires at field on checkout status response.
    #[serde(rename = "expiresAt")]
    pub expires_at: String,

    /// Next action field on checkout status response.
    #[serde(rename = "nextAction")]
    pub next_action: String,

    /// Order no field on checkout status response.
    #[serde(rename = "orderNo")]
    pub order_no: String,

    /// Order status field on checkout status response.
    #[serde(rename = "orderStatus")]
    pub order_status: String,

    /// Out trade no field on checkout status response.
    #[serde(rename = "outTradeNo")]
    pub out_trade_no: String,

    /// Paid at field on checkout status response.
    #[serde(rename = "paidAt")]
    pub paid_at: String,

    /// Payment method field on checkout status response.
    #[serde(rename = "paymentMethod")]
    pub payment_method: String,

    /// Payment status field on checkout status response.
    #[serde(rename = "paymentStatus")]
    pub payment_status: String,

    /// Points field on checkout status response.
    pub points: i64,

    /// Qr code payload field on checkout status response.
    #[serde(rename = "qrCodePayload")]
    pub qr_code_payload: String,

    /// Recharge status field on checkout status response.
    #[serde(rename = "rechargeStatus")]
    pub recharge_status: String,

    /// Status field on checkout status response.
    pub status: String,
}
