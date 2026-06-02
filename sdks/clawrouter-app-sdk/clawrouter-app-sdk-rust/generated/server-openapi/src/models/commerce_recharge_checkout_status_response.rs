use serde::{Deserialize, Serialize};

/// Commerce recharge checkout status response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRechargeCheckoutStatusResponse {
    /// Amount field on commerce recharge checkout status response.
    pub amount: String,

    /// Standard cashier page URL for scan_qr and open_url payment flows.
    #[serde(rename = "cashierUrl")]
    pub cashier_url: String,

    /// Created at field on commerce recharge checkout status response.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Currency code field on commerce recharge checkout status response.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Expires at field on commerce recharge checkout status response.
    #[serde(rename = "expiresAt")]
    pub expires_at: String,

    /// For PC qr checkout, scan_qr means the client should render a QR image from qrCodePayload and ask the user to scan it with the target payment app. request_payment means the H5 cashier should invoke a bridge payment request. open_url means the client should open cashierUrl in a browser context.
    #[serde(rename = "nextAction")]
    pub next_action: String,

    /// Order no field on commerce recharge checkout status response.
    #[serde(rename = "orderNo")]
    pub order_no: String,

    /// Order status field on commerce recharge checkout status response.
    #[serde(rename = "orderStatus")]
    pub order_status: String,

    /// Out trade no field on commerce recharge checkout status response.
    #[serde(rename = "outTradeNo")]
    pub out_trade_no: String,

    /// Paid at field on commerce recharge checkout status response.
    #[serde(rename = "paidAt")]
    pub paid_at: String,

    /// Payment method field on commerce recharge checkout status response.
    #[serde(rename = "paymentMethod")]
    pub payment_method: String,

    /// Payment product field on commerce recharge checkout status response.
    #[serde(rename = "paymentProduct")]
    pub payment_product: String,

    /// Payment status field on commerce recharge checkout status response.
    #[serde(rename = "paymentStatus")]
    pub payment_status: String,

    /// Points field on commerce recharge checkout status response.
    pub points: i64,

    /// Provider code field on commerce recharge checkout status response.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Standard QR payload field for recharge checkout. When nextAction is scan_qr, this value must be an http or https payment page URL rather than a native app scheme.
    #[serde(rename = "qrCodePayload")]
    pub qr_code_payload: String,

    /// Recharge status field on commerce recharge checkout status response.
    #[serde(rename = "rechargeStatus")]
    pub recharge_status: String,

    /// Request payment payload field on commerce recharge checkout status response.
    #[serde(rename = "requestPaymentPayload")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_payment_payload: Option<std::collections::HashMap<String, String>>,

    /// Status field on commerce recharge checkout status response.
    pub status: String,
}
