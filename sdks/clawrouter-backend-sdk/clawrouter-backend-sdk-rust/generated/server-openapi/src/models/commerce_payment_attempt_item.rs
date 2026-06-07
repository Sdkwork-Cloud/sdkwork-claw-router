use serde::{Deserialize, Serialize};

/// Commerce payment attempt item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentAttemptItem {
    /// Amount field on commerce payment attempt item.
    pub amount: String,

    /// Attempt no field on commerce payment attempt item.
    #[serde(rename = "attemptNo")]
    pub attempt_no: String,

    /// Created at field on commerce payment attempt item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Currency code field on commerce payment attempt item.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// External trade no field on commerce payment attempt item.
    #[serde(rename = "externalTradeNo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_trade_no: Option<String>,

    /// Id field on commerce payment attempt item.
    pub id: String,

    /// Intent id field on commerce payment attempt item.
    #[serde(rename = "intentId")]
    pub intent_id: String,

    /// Method code field on commerce payment attempt item.
    #[serde(rename = "methodCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub method_code: Option<String>,

    /// Paid at field on commerce payment attempt item.
    #[serde(rename = "paidAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub paid_at: Option<String>,

    /// Provider code field on commerce payment attempt item.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Status field on commerce payment attempt item.
    pub status: String,

    /// Updated at field on commerce payment attempt item.
    #[serde(rename = "updatedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}
