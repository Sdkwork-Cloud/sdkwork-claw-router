use serde::{Deserialize, Serialize};

/// Commerce payment intent item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentIntentItem {
    /// Amount field on commerce payment intent item.
    pub amount: String,

    /// Checkout session id field on commerce payment intent item.
    #[serde(rename = "checkoutSessionId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub checkout_session_id: Option<String>,

    /// Created at field on commerce payment intent item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Currency code field on commerce payment intent item.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Id field on commerce payment intent item.
    pub id: String,

    /// Intent no field on commerce payment intent item.
    #[serde(rename = "intentNo")]
    pub intent_no: String,

    /// Method code field on commerce payment intent item.
    #[serde(rename = "methodCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub method_code: Option<String>,

    /// Order id field on commerce payment intent item.
    #[serde(rename = "orderId")]
    pub order_id: String,

    /// Provider code field on commerce payment intent item.
    #[serde(rename = "providerCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Status field on commerce payment intent item.
    pub status: String,

    /// Subject type field on commerce payment intent item.
    #[serde(rename = "subjectType")]
    pub subject_type: String,

    /// Updated at field on commerce payment intent item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
