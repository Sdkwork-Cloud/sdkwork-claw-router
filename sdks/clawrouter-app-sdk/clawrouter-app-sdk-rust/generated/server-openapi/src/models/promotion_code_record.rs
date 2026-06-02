use serde::{Deserialize, Serialize};

/// Promotion code record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionCodeRecord {
    /// Activated at field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub activated_at: Option<String>,

    /// Activation status field on promotion code record.
    pub activation_status: String,

    /// Can resend field on promotion code record.
    pub can_resend: bool,

    /// Cancel until field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cancel_until: Option<String>,

    /// Canceled at field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub canceled_at: Option<String>,

    /// Channel code field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_code: Option<String>,

    /// Claim code hash field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claim_code_hash: Option<String>,

    /// Claim code suffix field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claim_code_suffix: Option<String>,

    /// Claimed quantity field on promotion code record.
    pub claimed_quantity: String,

    /// Code no field on promotion code record.
    pub code_no: String,

    /// Code type field on promotion code record.
    pub code_type: String,

    /// Created at field on promotion code record.
    pub created_at: String,

    /// Created by field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// Currency code field on promotion code record.
    pub currency_code: String,

    /// Expires at field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Id field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Max claims field on promotion code record.
    pub max_claims: String,

    /// Offer id field on promotion code record.
    pub offer_id: String,

    /// Offer version id field on promotion code record.
    pub offer_version_id: String,

    /// Organization id field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Promotion code hash field on promotion code record.
    pub promotion_code_hash: String,

    /// Promotion code last 4 field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub promotion_code_last4: Option<String>,

    /// Starts at field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub starts_at: Option<String>,

    /// Status field on promotion code record.
    pub status: String,

    /// Stock id field on promotion code record.
    pub stock_id: String,

    /// Tenant id field on promotion code record.
    pub tenant_id: String,

    /// Updated at field on promotion code record.
    pub updated_at: String,

    /// Updated by field on promotion code record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_by: Option<String>,
}
