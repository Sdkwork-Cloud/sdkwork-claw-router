use serde::{Deserialize, Serialize};

use crate::models::{AdminCapacityPair, AdminCountPair, AdminUsagePair};

/// Persisted channel group snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminChannelGroupItem {
    /// Account count field on admin channel group item.
    #[serde(rename = "accountCount")]
    pub account_count: AdminCountPair,

    /// Capacity field on admin channel group item.
    pub capacity: AdminCapacityPair,

    /// Group code field on admin channel group item.
    #[serde(rename = "groupCode")]
    pub group_code: String,

    /// Group name field on admin channel group item.
    #[serde(rename = "groupName")]
    pub group_name: String,

    /// Group type field on admin channel group item.
    #[serde(rename = "groupType")]
    pub group_type: String,

    /// Id field on admin channel group item.
    pub id: String,

    /// Official price multiplier field on admin channel group item.
    #[serde(rename = "officialPriceMultiplier")]
    pub official_price_multiplier: f64,

    /// Price reference mode field on admin channel group item.
    #[serde(rename = "priceReferenceMode")]
    pub price_reference_mode: String,

    /// Provider code field on admin channel group item.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Rate multiplier field on admin channel group item.
    #[serde(rename = "rateMultiplier")]
    pub rate_multiplier: f64,

    /// Status field on admin channel group item.
    pub status: String,

    /// Usage field on admin channel group item.
    pub usage: AdminUsagePair,
}
