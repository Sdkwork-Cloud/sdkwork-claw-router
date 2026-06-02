use serde::{Deserialize, Serialize};

/// Commerce payment provider record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentProviderRecord {
    /// Created at field on commerce payment provider record.
    pub created_at: String,

    /// Display name field on commerce payment provider record.
    pub display_name: String,

    /// Id field on commerce payment provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on commerce payment provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider code field on commerce payment provider record.
    pub provider_code: String,

    /// Provider type field on commerce payment provider record.
    pub provider_type: String,

    /// Sort order field on commerce payment provider record.
    pub sort_order: String,

    /// Status field on commerce payment provider record.
    pub status: String,

    /// Supported countries field on commerce payment provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supported_countries: Option<std::collections::HashMap<String, String>>,

    /// Supported currencies field on commerce payment provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supported_currencies: Option<std::collections::HashMap<String, String>>,

    /// Supported methods field on commerce payment provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supported_methods: Option<std::collections::HashMap<String, String>>,

    /// Tenant id field on commerce payment provider record.
    pub tenant_id: String,

    /// Updated at field on commerce payment provider record.
    pub updated_at: String,
}
