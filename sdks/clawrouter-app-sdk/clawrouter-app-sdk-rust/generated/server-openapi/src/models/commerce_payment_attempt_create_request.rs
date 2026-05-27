use serde::{Deserialize, Serialize};

/// Commerce payment attempt create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentAttemptCreateRequest {
    /// Client request no field on commerce payment attempt create request.
    #[serde(rename = "clientRequestNo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_request_no: Option<String>,

    /// Method code field on commerce payment attempt create request.
    #[serde(rename = "methodCode")]
    pub method_code: String,

    /// Note field on commerce payment attempt create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub note: Option<String>,

    /// Provider code field on commerce payment attempt create request.
    #[serde(rename = "providerCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Return url field on commerce payment attempt create request.
    #[serde(rename = "returnUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub return_url: Option<String>,
}
