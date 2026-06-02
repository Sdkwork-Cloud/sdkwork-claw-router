use serde::{Deserialize, Serialize};

/// Commerce recharge order create response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRechargeOrderCreateResponse {
    /// Amount field on commerce recharge order create response.
    pub amount: String,

    /// Cashier url field on commerce recharge order create response.
    #[serde(rename = "cashierUrl")]
    pub cashier_url: String,

    /// Currency code field on commerce recharge order create response.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Next action field on commerce recharge order create response.
    #[serde(rename = "nextAction")]
    pub next_action: String,

    /// Order no field on commerce recharge order create response.
    #[serde(rename = "orderNo")]
    pub order_no: String,

    /// Standardized payment method code for portal consumption. Prefer business-facing values such as wechat, alipay, or card.
    #[serde(rename = "paymentMethod")]
    pub payment_method: String,

    /// Payment product field on commerce recharge order create response.
    #[serde(rename = "paymentProduct")]
    pub payment_product: String,

    /// Points field on commerce recharge order create response.
    pub points: i64,

    /// Provider code field on commerce recharge order create response.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Qr code payload field on commerce recharge order create response.
    #[serde(rename = "qrCodePayload")]
    pub qr_code_payload: String,

    /// Request payment payload field on commerce recharge order create response.
    #[serde(rename = "requestPaymentPayload")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_payment_payload: Option<std::collections::HashMap<String, String>>,

    /// Status field on commerce recharge order create response.
    pub status: String,

    /// Success field on commerce recharge order create response.
    pub success: bool,
}
