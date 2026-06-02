use serde::{Deserialize, Serialize};

/// Promotion user coupon record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionUserCouponRecord {
    /// Activation status field on promotion user coupon record.
    pub activation_status: String,

    /// Budget account id field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub budget_account_id: Option<String>,

    /// Can resend field on promotion user coupon record.
    pub can_resend: bool,

    /// Cancel until field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cancel_until: Option<String>,

    /// Claim code hash field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claim_code_hash: Option<String>,

    /// Claim code suffix field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claim_code_suffix: Option<String>,

    /// Claim source field on promotion user coupon record.
    pub claim_source: String,

    /// Claimed at field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claimed_at: Option<String>,

    /// Code id field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code_id: Option<String>,

    /// Coupon code hash field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub coupon_code_hash: Option<String>,

    /// Coupon code suffix field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub coupon_code_suffix: Option<String>,

    /// Coupon no field on promotion user coupon record.
    pub coupon_no: String,

    /// Created at field on promotion user coupon record.
    pub created_at: String,

    /// Currency code field on promotion user coupon record.
    pub currency_code: String,

    /// Disabled at field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub disabled_at: Option<String>,

    /// Discount percent bps field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub discount_percent_bps: Option<i64>,

    /// Expires at field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Face value minor field on promotion user coupon record.
    pub face_value_minor: String,

    /// Id field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on promotion user coupon record.
    pub idempotency_key: String,

    /// Lock expires at field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub lock_expires_at: Option<String>,

    /// Locked at field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub locked_at: Option<String>,

    /// Maximum discount amount minor field on promotion user coupon record.
    pub maximum_discount_amount_minor: String,

    /// Minimum order amount minor field on promotion user coupon record.
    pub minimum_order_amount_minor: String,

    /// Offer id field on promotion user coupon record.
    pub offer_id: String,

    /// Offer version id field on promotion user coupon record.
    pub offer_version_id: String,

    /// Organization id field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_user_id: Option<String>,

    /// Recognition hash field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recognition_hash: Option<String>,

    /// Recognition type field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recognition_type: Option<String>,

    /// Redeemed at field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub redeemed_at: Option<String>,

    /// Request no field on promotion user coupon record.
    pub request_no: String,

    /// Returned at field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub returned_at: Option<String>,

    /// Status field on promotion user coupon record.
    pub status: String,

    /// Stock id field on promotion user coupon record.
    pub stock_id: String,

    /// Subject id field on promotion user coupon record.
    pub subject_id: String,

    /// Subject type field on promotion user coupon record.
    pub subject_type: String,

    /// Tenant id field on promotion user coupon record.
    pub tenant_id: String,

    /// Updated at field on promotion user coupon record.
    pub updated_at: String,

    /// Valid from field on promotion user coupon record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub valid_from: Option<String>,

    /// Verify method field on promotion user coupon record.
    pub verify_method: String,
}
