use serde::{Deserialize, Serialize};

/// Provider config schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ProviderConfig {
    /// Description field on provider config.
    pub description: String,

    /// Id field on provider config.
    pub id: String,

    /// Integration type field on provider config.
    #[serde(rename = "integrationType")]
    pub integration_type: String,

    /// Name field on provider config.
    pub name: String,

    /// Provider family field on provider config.
    #[serde(rename = "providerFamily")]
    pub provider_family: String,

    /// Status field on provider config.
    pub status: String,

    /// Provider public endpoint URL or safe proxy endpoint.
    pub url: String,
}
