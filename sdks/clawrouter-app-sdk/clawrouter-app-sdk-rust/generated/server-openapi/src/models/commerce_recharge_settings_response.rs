use serde::{Deserialize, Serialize};

/// Commerce recharge settings response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRechargeSettingsResponse {
    /// Base currency code field on commerce recharge settings response.
    #[serde(rename = "baseCurrencyCode")]
    pub base_currency_code: String,

    /// Base points per cny field on commerce recharge settings response.
    #[serde(rename = "basePointsPerCny")]
    pub base_points_per_cny: String,

    /// Currency to cny rates field on commerce recharge settings response.
    #[serde(rename = "currencyToCnyRates")]
    pub currency_to_cny_rates: std::collections::HashMap<String, String>,

    /// Preview examples field on commerce recharge settings response.
    #[serde(rename = "previewExamples")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub preview_examples: Option<std::collections::HashMap<String, std::collections::HashMap<String, serde_json::Value>>>,
}
