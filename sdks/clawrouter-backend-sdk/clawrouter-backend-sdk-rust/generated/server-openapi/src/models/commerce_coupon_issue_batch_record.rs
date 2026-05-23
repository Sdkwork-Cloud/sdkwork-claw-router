use serde::{Deserialize, Serialize};

/// Commerce coupon issue batch record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCouponIssueBatchRecord {
    /// Audience filter field on commerce coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub audience_filter: Option<String>,

    /// Batch no field on commerce coupon issue batch record.
    pub batch_no: String,

    /// Campaign code field on commerce coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub campaign_code: Option<String>,

    /// Code pattern field on commerce coupon issue batch record.
    pub code_pattern: String,

    /// Code prefix field on commerce coupon issue batch record.
    pub code_prefix: String,

    /// Coupon template id field on commerce coupon issue batch record.
    pub coupon_template_id: String,

    /// Created at field on commerce coupon issue batch record.
    pub created_at: String,

    /// Created by field on commerce coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// Generated at field on commerce coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub generated_at: Option<String>,

    /// Generation status field on commerce coupon issue batch record.
    pub generation_status: String,

    /// Organization id field on commerce coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Requested quantity field on commerce coupon issue batch record.
    pub requested_quantity: String,

    /// Status field on commerce coupon issue batch record.
    pub status: String,

    /// Tenant id field on commerce coupon issue batch record.
    pub tenant_id: String,

    /// Title field on commerce coupon issue batch record.
    pub title: String,

    /// Updated at field on commerce coupon issue batch record.
    pub updated_at: String,
}
