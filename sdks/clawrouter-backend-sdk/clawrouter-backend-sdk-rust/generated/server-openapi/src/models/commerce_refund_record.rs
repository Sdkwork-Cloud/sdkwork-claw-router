use serde::{Deserialize, Serialize};

/// Commerce refund record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRefundRecord {
    /// Amount field on commerce refund record.
    pub amount: String,

    /// Created at field on commerce refund record.
    pub created_at: String,

    /// Idempotency key field on commerce refund record.
    pub idempotency_key: String,

    /// Payment attempt id field on commerce refund record.
    pub payment_attempt_id: String,

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
