use serde::{Deserialize, Serialize};

/// Commerce payment runtime assembly summary schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentRuntimeAssemblySummary {
    /// Failed field on commerce payment runtime assembly summary.
    pub failed: String,

    /// Failed provider codes field on commerce payment runtime assembly summary.
    #[serde(rename = "failedProviderCodes")]
    pub failed_provider_codes: Vec<String>,

    /// Registered field on commerce payment runtime assembly summary.
    pub registered: String,

    /// Registered provider codes field on commerce payment runtime assembly summary.
    #[serde(rename = "registeredProviderCodes")]
    pub registered_provider_codes: Vec<String>,

    /// Skipped field on commerce payment runtime assembly summary.
    pub skipped: String,

    /// Skipped provider codes field on commerce payment runtime assembly summary.
    #[serde(rename = "skippedProviderCodes")]
    pub skipped_provider_codes: Vec<String>,

    /// Total field on commerce payment runtime assembly summary.
    pub total: String,
}
