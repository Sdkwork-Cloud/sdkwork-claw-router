use serde::{Deserialize, Serialize};

/// Commerce payment provider account item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentProviderAccountItem {
    /// Account no field on commerce payment provider account item.
    #[serde(rename = "accountNo")]
    pub account_no: String,

    /// Account role field on commerce payment provider account item.
    #[serde(rename = "accountRole")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_role: Option<String>,

    /// Certificate ref field on commerce payment provider account item.
    #[serde(rename = "certificateRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub certificate_ref: Option<String>,

    /// Country code field on commerce payment provider account item.
    #[serde(rename = "countryCode")]
    pub country_code: String,

    /// Created at field on commerce payment provider account item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Environment field on commerce payment provider account item.
    pub environment: String,

    /// Id field on commerce payment provider account item.
    pub id: String,

    /// Merchant id field on commerce payment provider account item.
    #[serde(rename = "merchantId")]
    pub merchant_id: String,

    /// Note field on commerce payment provider account item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub note: Option<String>,

    /// Provider code field on commerce payment provider account item.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Rotated at field on commerce payment provider account item.
    #[serde(rename = "rotatedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rotated_at: Option<String>,

    /// Secret ref field on commerce payment provider account item.
    #[serde(rename = "secretRef")]
    pub secret_ref: String,

    /// Settlement currency field on commerce payment provider account item.
    #[serde(rename = "settlementCurrency")]
    pub settlement_currency: String,

    /// Status field on commerce payment provider account item.
    pub status: String,

    /// Updated at field on commerce payment provider account item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// Webhook secret ref field on commerce payment provider account item.
    #[serde(rename = "webhookSecretRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub webhook_secret_ref: Option<String>,
}
