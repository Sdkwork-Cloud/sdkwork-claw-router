use serde::{Deserialize, Serialize};

/// Commerce membership package record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceMembershipPackageRecord {
    /// Created at field on commerce membership package record.
    pub created_at: String,

    /// Currency code field on commerce membership package record.
    pub currency_code: String,

    /// Duration days field on commerce membership package record.
    pub duration_days: String,

    /// Ends at field on commerce membership package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ends_at: Option<String>,

    /// Id field on commerce membership package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on commerce membership package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Package group id field on commerce membership package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_group_id: Option<String>,

    /// Package no field on commerce membership package record.
    pub package_no: String,

    /// Plan id field on commerce membership package record.
    pub plan_id: String,

    /// Price amount field on commerce membership package record.
    pub price_amount: String,

    /// Recurrence cycle field on commerce membership package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recurrence_cycle: Option<String>,

    /// Sku id field on commerce membership package record.
    pub sku_id: String,

    /// Sort order field on commerce membership package record.
    pub sort_order: String,

    /// Starts at field on commerce membership package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub starts_at: Option<String>,

    /// Status field on commerce membership package record.
    pub status: String,

    /// Tenant id field on commerce membership package record.
    pub tenant_id: String,

    /// Updated at field on commerce membership package record.
    pub updated_at: String,
}
