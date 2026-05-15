use serde::{Deserialize, Serialize};

/// Commerce wallet account item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceWalletAccountItem {
    /// Asset type field on commerce wallet account item.
    #[serde(rename = "assetType")]
    pub asset_type: String,

    /// Available amount field on commerce wallet account item.
    #[serde(rename = "availableAmount")]
    pub available_amount: String,

    /// Currency code field on commerce wallet account item.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Frozen amount field on commerce wallet account item.
    #[serde(rename = "frozenAmount")]
    pub frozen_amount: String,

    /// Id field on commerce wallet account item.
    pub id: String,

    /// Status field on commerce wallet account item.
    pub status: String,
}
