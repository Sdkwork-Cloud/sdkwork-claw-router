use serde::{Deserialize, Serialize};

use crate::models::{AdminCapacityPair, AdminCountPair, AdminUsagePair};

/// Persisted access group snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAccessGroupItem {
    /// Account count field on admin access group item.
    #[serde(rename = "accountCount")]
    pub account_count: AdminCountPair,

    /// Billing type field on admin access group item.
    #[serde(rename = "billingType")]
    pub billing_type: String,

    /// Capacity field on admin access group item.
    pub capacity: AdminCapacityPair,

    /// Id field on admin access group item.
    pub id: String,

    /// Name field on admin access group item.
    pub name: String,

    /// Platform field on admin access group item.
    pub platform: String,

    /// Rate multiplier field on admin access group item.
    #[serde(rename = "rateMultiplier")]
    pub rate_multiplier: f64,

    /// Status field on admin access group item.
    pub status: String,

    /// Type field on admin access group item.
    pub r#type: String,

    /// Usage field on admin access group item.
    pub usage: AdminUsagePair,
}
