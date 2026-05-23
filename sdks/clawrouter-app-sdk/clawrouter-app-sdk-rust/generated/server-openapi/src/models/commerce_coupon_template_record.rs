use serde::{Deserialize, Serialize};

/// Commerce coupon template record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCouponTemplateRecord {
    /// Created at field on commerce coupon template record.
    pub created_at: String,

    /// Discount type field on commerce coupon template record.
    pub discount_type: String,

    /// Discount value field on commerce coupon template record.
    pub discount_value: String,

    /// Expires at field on commerce coupon template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Organization id field on commerce coupon template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Starts at field on commerce coupon template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub starts_at: Option<String>,

    /// Status field on commerce coupon template record.
    pub status: String,

    /// Template no field on commerce coupon template record.
    pub template_no: String,

    /// Tenant id field on commerce coupon template record.
    pub tenant_id: String,

    /// Title field on commerce coupon template record.
    pub title: String,

    /// Total quantity field on commerce coupon template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_quantity: Option<String>,

    /// Updated at field on commerce coupon template record.
    pub updated_at: String,
}
