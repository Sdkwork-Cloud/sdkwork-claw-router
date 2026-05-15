use serde::{Deserialize, Serialize};

/// Admin promo code item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminPromoCodeItem {
    /// Batch id field on admin promo code item.
    #[serde(rename = "batchId")]
    pub batch_id: String,

    /// Code field on admin promo code item.
    pub code: String,

    /// Id field on admin promo code item.
    pub id: String,

    /// Status field on admin promo code item.
    pub status: String,

    /// Used at field on admin promo code item.
    #[serde(rename = "usedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub used_at: Option<String>,

    /// Used by field on admin promo code item.
    #[serde(rename = "usedBy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub used_by: Option<String>,
}
