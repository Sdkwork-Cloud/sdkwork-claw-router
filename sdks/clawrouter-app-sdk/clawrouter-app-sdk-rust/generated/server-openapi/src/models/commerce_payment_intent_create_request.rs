use serde::{Deserialize, Serialize};

/// Commerce payment intent create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentIntentCreateRequest {
    /// Amount field on commerce payment intent create request.
    pub amount: String,

    /// Checkout session id field on commerce payment intent create request.
    #[serde(rename = "checkoutSessionId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub checkout_session_id: Option<String>,

    /// Client request no field on commerce payment intent create request.
    #[serde(rename = "clientRequestNo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_request_no: Option<String>,

    /// Currency code field on commerce payment intent create request.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Method code field on commerce payment intent create request.
    #[serde(rename = "methodCode")]
    pub method_code: String,

    /// Note field on commerce payment intent create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub note: Option<String>,

    /// Order id field on commerce payment intent create request.
    #[serde(rename = "orderId")]
    pub order_id: String,

    /// Subject type field on commerce payment intent create request.
    #[serde(rename = "subjectType")]
    pub subject_type: String,
}
