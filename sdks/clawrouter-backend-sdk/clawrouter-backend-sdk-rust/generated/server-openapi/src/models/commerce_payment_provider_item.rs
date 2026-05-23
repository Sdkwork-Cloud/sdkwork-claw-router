use serde::{Deserialize, Serialize};

/// Commerce payment provider item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentProviderItem {
    /// Capabilities field on commerce payment provider item.
    pub capabilities: Vec<String>,

    /// Created at field on commerce payment provider item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Display name field on commerce payment provider item.
    #[serde(rename = "displayName")]
    pub display_name: String,

    /// Id field on commerce payment provider item.
    pub id: String,

    /// Provider code field on commerce payment provider item.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Provider type field on commerce payment provider item.
    #[serde(rename = "providerType")]
    pub provider_type: String,

    /// Settlement type field on commerce payment provider item.
    #[serde(rename = "settlementType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_type: Option<String>,

    /// Status field on commerce payment provider item.
    pub status: String,

    /// Supported countries field on commerce payment provider item.
    #[serde(rename = "supportedCountries")]
    pub supported_countries: Vec<String>,

    /// Supported currencies field on commerce payment provider item.
    #[serde(rename = "supportedCurrencies")]
    pub supported_currencies: Vec<String>,

    /// Updated at field on commerce payment provider item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
