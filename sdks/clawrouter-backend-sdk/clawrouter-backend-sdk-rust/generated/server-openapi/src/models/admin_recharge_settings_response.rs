use serde::{Deserialize, Serialize};

/// Admin recharge settings response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminRechargeSettingsResponse {
    /// Base currency code field on admin recharge settings response.
    #[serde(rename = "baseCurrencyCode")]
    pub base_currency_code: String,

    /// Base points per cny field on admin recharge settings response.
    #[serde(rename = "basePointsPerCny")]
    pub base_points_per_cny: String,

    /// Currency to cny rates field on admin recharge settings response.
    #[serde(rename = "currencyToCnyRates")]
    pub currency_to_cny_rates: std::collections::HashMap<String, String>,
}
