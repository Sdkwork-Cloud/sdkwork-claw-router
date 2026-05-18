use serde::{Deserialize, Serialize};

/// Commerce exchange rule upsert request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceExchangeRuleUpsertRequest {
    /// Rate field on commerce exchange rule upsert request.
    pub rate: String,

    /// Source asset type field on commerce exchange rule upsert request.
    #[serde(rename = "sourceAssetType")]
    pub source_asset_type: String,

    /// Status field on commerce exchange rule upsert request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target asset type field on commerce exchange rule upsert request.
    #[serde(rename = "targetAssetType")]
    pub target_asset_type: String,
}
