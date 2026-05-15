use serde::{Deserialize, Serialize};

/// Commerce points exchange rate response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePointsExchangeRateResponse {
    /// Rate field on commerce points exchange rate response.
    pub rate: String,

    /// Source asset type field on commerce points exchange rate response.
    #[serde(rename = "sourceAssetType")]
    pub source_asset_type: String,

    /// Target asset type field on commerce points exchange rate response.
    #[serde(rename = "targetAssetType")]
    pub target_asset_type: String,
}
