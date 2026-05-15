use serde::{Deserialize, Serialize};

/// Commerce wallet overview response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceWalletOverviewResponse {
    /// Available amount field on commerce wallet overview response.
    #[serde(rename = "availableAmount")]
    pub available_amount: String,

    /// Currency code field on commerce wallet overview response.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Frozen amount field on commerce wallet overview response.
    #[serde(rename = "frozenAmount")]
    pub frozen_amount: String,
}
