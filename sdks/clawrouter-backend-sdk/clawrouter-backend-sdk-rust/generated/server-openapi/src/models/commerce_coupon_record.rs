use serde::{Deserialize, Serialize};

/// Commerce coupon record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCouponRecord {
    /// Claimed at field on commerce coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claimed_at: Option<String>,

    /// Coupon code field on commerce coupon record.
    pub coupon_code: String,

    /// Created at field on commerce coupon record.
    pub created_at: String,

    /// Disabled at field on commerce coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub disabled_at: Option<String>,

    /// Expires at field on commerce coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Idempotency key field on commerce coupon record.
    pub idempotency_key: String,

    /// Issue batch id field on commerce coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub issue_batch_id: Option<String>,

    /// Organization id field on commerce coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_user_id: Option<String>,

    /// Redeemed at field on commerce coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub redeemed_at: Option<String>,

    /// Request no field on commerce coupon record.
    pub request_no: String,

    /// Status field on commerce coupon record.
    pub status: String,

    /// Template id field on commerce coupon record.
    pub template_id: String,

    /// Tenant id field on commerce coupon record.
    pub tenant_id: String,

    /// Updated at field on commerce coupon record.
    pub updated_at: String,
}
