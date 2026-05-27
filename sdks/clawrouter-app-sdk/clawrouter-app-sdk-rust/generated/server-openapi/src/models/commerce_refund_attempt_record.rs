use serde::{Deserialize, Serialize};

/// Commerce refund attempt record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRefundAttemptRecord {
    /// Amount field on commerce refund attempt record.
    pub amount: String,

    /// Created at field on commerce refund attempt record.
    pub created_at: String,

    /// Currency code field on commerce refund attempt record.
    pub currency_code: String,

    /// Failed at field on commerce refund attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failed_at: Option<String>,

    /// Failure code field on commerce refund attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_code: Option<String>,

    /// Failure message field on commerce refund attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_message: Option<String>,

    /// Organization id field on commerce refund attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Out refund no field on commerce refund attempt record.
    pub out_refund_no: String,

    /// Provider account id field on commerce refund attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on commerce refund attempt record.
    pub provider_code: String,

    /// Provider refund id field on commerce refund attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_refund_id: Option<String>,

    /// Refund attempt no field on commerce refund attempt record.
    pub refund_attempt_no: String,

    /// Refund id field on commerce refund attempt record.
    pub refund_id: String,

    /// Status field on commerce refund attempt record.
    pub status: String,

    /// Submitted at field on commerce refund attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub submitted_at: Option<String>,

    /// Succeeded at field on commerce refund attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub succeeded_at: Option<String>,

    /// Tenant id field on commerce refund attempt record.
    pub tenant_id: String,

    /// Updated at field on commerce refund attempt record.
    pub updated_at: String,
}
