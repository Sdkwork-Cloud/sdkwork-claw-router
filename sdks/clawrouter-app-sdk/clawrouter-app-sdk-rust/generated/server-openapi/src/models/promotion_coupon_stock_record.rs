use serde::{Deserialize, Serialize};

/// Promotion coupon stock record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionCouponStockRecord {
    /// Activation status field on promotion coupon stock record.
    pub activation_status: String,

    /// Available quantity field on promotion coupon stock record.
    pub available_quantity: String,

    /// Budget account id field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub budget_account_id: Option<String>,

    /// Budget stop threshold bps field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub budget_stop_threshold_bps: Option<i64>,

    /// Budget warning threshold bps field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub budget_warning_threshold_bps: Option<i64>,

    /// Can resend field on promotion coupon stock record.
    pub can_resend: bool,

    /// Cancel until field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cancel_until: Option<String>,

    /// Claimed quantity field on promotion coupon stock record.
    pub claimed_quantity: String,

    /// Code mode field on promotion coupon stock record.
    pub code_mode: String,

    /// Code prefix field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code_prefix: Option<String>,

    /// Created at field on promotion coupon stock record.
    pub created_at: String,

    /// Created by field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// Currency code field on promotion coupon stock record.
    pub currency_code: String,

    /// Disabled quantity field on promotion coupon stock record.
    pub disabled_quantity: String,

    /// Expires at field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Generated quantity field on promotion coupon stock record.
    pub generated_quantity: String,

    /// Id field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Issue channel field on promotion coupon stock record.
    pub issue_channel: String,

    /// Locked quantity field on promotion coupon stock record.
    pub locked_quantity: String,

    /// Max claims per natural person field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_claims_per_natural_person: Option<i64>,

    /// Max claims per subject field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_claims_per_subject: Option<i64>,

    /// Name field on promotion coupon stock record.
    pub name: String,

    /// Offer id field on promotion coupon stock record.
    pub offer_id: String,

    /// Offer version id field on promotion coupon stock record.
    pub offer_version_id: String,

    /// Organization id field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Overspend policy field on promotion coupon stock record.
    pub overspend_policy: String,

    /// Per subject limit field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub per_subject_limit: Option<String>,

    /// Redeemed quantity field on promotion coupon stock record.
    pub redeemed_quantity: String,

    /// Requested quantity field on promotion coupon stock record.
    pub requested_quantity: String,

    /// Returned quantity field on promotion coupon stock record.
    pub returned_quantity: String,

    /// Starts at field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub starts_at: Option<String>,

    /// Status field on promotion coupon stock record.
    pub status: String,

    /// Stock creator merchant id field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub stock_creator_merchant_id: Option<String>,

    /// Stock no field on promotion coupon stock record.
    pub stock_no: String,

    /// Stock type field on promotion coupon stock record.
    pub stock_type: String,

    /// Tenant id field on promotion coupon stock record.
    pub tenant_id: String,

    /// Title field on promotion coupon stock record.
    pub title: String,

    /// Total quantity field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_quantity: Option<String>,

    /// Updated at field on promotion coupon stock record.
    pub updated_at: String,

    /// Updated by field on promotion coupon stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_by: Option<String>,
}
