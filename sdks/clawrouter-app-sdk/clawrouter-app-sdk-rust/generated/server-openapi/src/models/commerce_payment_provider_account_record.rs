use serde::{Deserialize, Serialize};

/// Commerce payment provider account record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentProviderAccountRecord {
    /// Account no field on commerce payment provider account record.
    pub account_no: String,

    /// Certificate ref field on commerce payment provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub certificate_ref: Option<String>,

    /// Country code field on commerce payment provider account record.
    pub country_code: String,

    /// Created at field on commerce payment provider account record.
    pub created_at: String,

    /// Environment field on commerce payment provider account record.
    pub environment: String,

    /// Merchant id field on commerce payment provider account record.
    pub merchant_id: String,

    /// Organization id field on commerce payment provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider code field on commerce payment provider account record.
    pub provider_code: String,

    /// Rotated at field on commerce payment provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rotated_at: Option<String>,

    /// Secret ref field on commerce payment provider account record.
    pub secret_ref: String,

    /// Settlement currency field on commerce payment provider account record.
    pub settlement_currency: String,

    /// Status field on commerce payment provider account record.
    pub status: String,

    /// Tenant id field on commerce payment provider account record.
    pub tenant_id: String,

    /// Updated at field on commerce payment provider account record.
    pub updated_at: String,

    /// Webhook secret ref field on commerce payment provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub webhook_secret_ref: Option<String>,
}
