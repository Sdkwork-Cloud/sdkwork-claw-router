use serde::{Deserialize, Serialize};

/// Commerce payment provider capability record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentProviderCapabilityRecord {
    /// Capability code field on commerce payment provider capability record.
    pub capability_code: String,

    /// Country code field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub country_code: Option<String>,

    /// Created at field on commerce payment provider capability record.
    pub created_at: String,

    /// Currency code field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency_code: Option<String>,

    /// Effective from field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Max amount field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_amount: Option<String>,

    /// Metadata json field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata_json: Option<std::collections::HashMap<String, String>>,

    /// Method code field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub method_code: Option<String>,

    /// Min amount field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub min_amount: Option<String>,

    /// Native operation codes field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub native_operation_codes: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider account id field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on commerce payment provider capability record.
    pub provider_code: String,

    /// Scene code field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scene_code: Option<String>,

    /// Status field on commerce payment provider capability record.
    pub status: String,

    /// Supported statement types field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supported_statement_types: Option<std::collections::HashMap<String, String>>,

    /// Supported webhook events field on commerce payment provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supported_webhook_events: Option<std::collections::HashMap<String, String>>,

    /// Tenant id field on commerce payment provider capability record.
    pub tenant_id: String,

    /// Updated at field on commerce payment provider capability record.
    pub updated_at: String,
}
