use serde::{Deserialize, Serialize};

/// Commerce exchange rule item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceExchangeRuleItem {
    /// Id field on commerce exchange rule item.
    pub id: String,

    /// Rate field on commerce exchange rule item.
    pub rate: String,

    /// Source asset type field on commerce exchange rule item.
    #[serde(rename = "sourceAssetType")]
    pub source_asset_type: String,

    /// Status field on commerce exchange rule item.
    pub status: String,

    /// Target asset type field on commerce exchange rule item.
    #[serde(rename = "targetAssetType")]
    pub target_asset_type: String,
}
