use serde::{Deserialize, Serialize};

/// Promotion offer time window record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionOfferTimeWindowRecord {
    /// Created at field on promotion offer time window record.
    pub created_at: String,

    /// Ends at field on promotion offer time window record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ends_at: Option<String>,

    /// Local end time field on promotion offer time window record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub local_end_time: Option<String>,

    /// Local start time field on promotion offer time window record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub local_start_time: Option<String>,

    /// Offer version id field on promotion offer time window record.
    pub offer_version_id: String,

    /// Organization id field on promotion offer time window record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Starts at field on promotion offer time window record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub starts_at: Option<String>,

    /// Tenant id field on promotion offer time window record.
    pub tenant_id: String,

    /// Timezone field on promotion offer time window record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub timezone: Option<String>,

    /// Updated at field on promotion offer time window record.
    pub updated_at: String,

    /// Weekday mask field on promotion offer time window record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weekday_mask: Option<i64>,

    /// Window type field on promotion offer time window record.
    pub window_type: String,
}
