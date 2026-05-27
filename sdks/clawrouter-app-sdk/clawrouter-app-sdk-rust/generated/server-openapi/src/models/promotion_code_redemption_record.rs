use serde::{Deserialize, Serialize};

/// Promotion code redemption record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionCodeRedemptionRecord {
    /// Code id field on promotion code redemption record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code_id: Option<String>,

    /// Created at field on promotion code redemption record.
    pub created_at: String,

    /// Currency code field on promotion code redemption record.
    pub currency_code: String,

    /// Failure code field on promotion code redemption record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_code: Option<String>,

    /// Failure message field on promotion code redemption record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_message: Option<String>,

    /// Idempotency key field on promotion code redemption record.
    pub idempotency_key: String,

    /// Occurred at field on promotion code redemption record.
    pub occurred_at: String,

    /// Offer id field on promotion code redemption record.
    pub offer_id: String,

    /// Offer version id field on promotion code redemption record.
    pub offer_version_id: String,

    /// Organization id field on promotion code redemption record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on promotion code redemption record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_user_id: Option<String>,

    /// Redemption channel field on promotion code redemption record.
    pub redemption_channel: String,

    /// Redemption no field on promotion code redemption record.
    pub redemption_no: String,

    /// Redemption scene field on promotion code redemption record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub redemption_scene: Option<String>,

    /// Request no field on promotion code redemption record.
    pub request_no: String,

    /// Result status field on promotion code redemption record.
    pub result_status: String,

    /// Stock id field on promotion code redemption record.
    pub stock_id: String,

    /// Subject id field on promotion code redemption record.
    pub subject_id: String,

    /// Subject type field on promotion code redemption record.
    pub subject_type: String,

    /// Submitted code hash field on promotion code redemption record.
    pub submitted_code_hash: String,

    /// Submitted code suffix field on promotion code redemption record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub submitted_code_suffix: Option<String>,

    /// Tenant id field on promotion code redemption record.
    pub tenant_id: String,

    /// User coupon id field on promotion code redemption record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_coupon_id: Option<String>,
}
