use serde::{Deserialize, Serialize};

/// Ops coupon issue batch record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsCouponIssueBatchRecord {
    /// Audience filter field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub audience_filter: Option<std::collections::HashMap<String, String>>,

    /// Available count field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub available_count: Option<String>,

    /// Batch no field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub batch_no: Option<String>,

    /// Campaign code field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub campaign_code: Option<String>,

    /// Claimed count field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claimed_count: Option<String>,

    /// Code pattern field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code_pattern: Option<String>,

    /// Code prefix field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code_prefix: Option<String>,

    /// Coupon id field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub coupon_id: Option<String>,

    /// Coupon template id field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub coupon_template_id: Option<String>,

    /// Created at field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Created by field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// Data scope field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Expire at field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expire_at: Option<String>,

    /// Generated at field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub generated_at: Option<String>,

    /// Generated count field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub generated_count: Option<String>,

    /// Generation status field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub generation_status: Option<String>,

    /// Id field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Name field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Requested count field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requested_count: Option<String>,

    /// Status field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Used count field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub used_count: Option<String>,

    /// Uuid field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Voided count field on ops coupon issue batch record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub voided_count: Option<String>,
}
