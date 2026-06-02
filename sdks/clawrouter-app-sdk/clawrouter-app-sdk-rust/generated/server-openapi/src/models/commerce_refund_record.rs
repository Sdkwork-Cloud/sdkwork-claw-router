use serde::{Deserialize, Serialize};

/// Commerce refund record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRefundRecord {
    /// Amount field on commerce refund record.
    pub amount: String,

    /// Created at field on commerce refund record.
    pub created_at: String,

    /// Currency code field on commerce refund record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency_code: Option<String>,

    /// Id field on commerce refund record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce refund record.
    pub idempotency_key: String,

    /// Organization id field on commerce refund record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payment attempt id field on commerce refund record.
    pub payment_attempt_id: String,

    /// Payment intent id field on commerce refund record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payment_intent_id: Option<String>,

    /// Provider code field on commerce refund record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Reason field on commerce refund record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,

    /// Refund no field on commerce refund record.
    pub refund_no: String,

    /// Request no field on commerce refund record.
    pub request_no: String,

    /// Status field on commerce refund record.
    pub status: String,

    /// Tenant id field on commerce refund record.
    pub tenant_id: String,

    /// Updated at field on commerce refund record.
    pub updated_at: String,
}
