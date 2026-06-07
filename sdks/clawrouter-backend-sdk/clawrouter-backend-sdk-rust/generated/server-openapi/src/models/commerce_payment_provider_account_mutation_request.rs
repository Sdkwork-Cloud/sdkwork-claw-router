use serde::{Deserialize, Serialize};

/// Commerce payment provider account mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentProviderAccountMutationRequest {
    /// Account role field on commerce payment provider account mutation request.
    #[serde(rename = "accountRole")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_role: Option<String>,

    /// Certificate ref field on commerce payment provider account mutation request.
    #[serde(rename = "certificateRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub certificate_ref: Option<String>,

    /// Client request no field on commerce payment provider account mutation request.
    #[serde(rename = "clientRequestNo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_request_no: Option<String>,

    /// Country code field on commerce payment provider account mutation request.
    #[serde(rename = "countryCode")]
    pub country_code: String,

    /// Environment field on commerce payment provider account mutation request.
    pub environment: String,

    /// Merchant id field on commerce payment provider account mutation request.
    #[serde(rename = "merchantId")]
    pub merchant_id: String,

    /// Note field on commerce payment provider account mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub note: Option<String>,

    /// Provider code field on commerce payment provider account mutation request.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Rotated at field on commerce payment provider account mutation request.
    #[serde(rename = "rotatedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rotated_at: Option<String>,

    /// Secret ref field on commerce payment provider account mutation request.
    #[serde(rename = "secretRef")]
    pub secret_ref: String,

    /// Settlement currency field on commerce payment provider account mutation request.
    #[serde(rename = "settlementCurrency")]
    pub settlement_currency: String,

    /// Status field on commerce payment provider account mutation request.
    pub status: String,

    /// Webhook secret ref field on commerce payment provider account mutation request.
    #[serde(rename = "webhookSecretRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub webhook_secret_ref: Option<String>,
}
