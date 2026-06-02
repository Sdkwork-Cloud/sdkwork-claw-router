use serde::{Deserialize, Serialize};

/// Commerce recharge settings update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRechargeSettingsUpdateRequest {
    /// Base currency code field on commerce recharge settings update request.
    #[serde(rename = "baseCurrencyCode")]
    pub base_currency_code: String,

    /// Base points per cny field on commerce recharge settings update request.
    #[serde(rename = "basePointsPerCny")]
    pub base_points_per_cny: String,

    /// Currency to cny rates field on commerce recharge settings update request.
    #[serde(rename = "currencyToCnyRates")]
    pub currency_to_cny_rates: std::collections::HashMap<String, String>,
}
