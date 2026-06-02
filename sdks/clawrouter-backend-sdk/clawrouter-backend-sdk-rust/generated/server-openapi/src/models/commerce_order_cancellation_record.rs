use serde::{Deserialize, Serialize};

/// Commerce order cancellation record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceOrderCancellationRecord {
    /// Approved by field on commerce order cancellation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approved_by: Option<String>,

    /// Cancellation no field on commerce order cancellation record.
    pub cancellation_no: String,

    /// Completed at field on commerce order cancellation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Created at field on commerce order cancellation record.
    pub created_at: String,

    /// Id field on commerce order cancellation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce order cancellation record.
    pub idempotency_key: String,

    /// Order id field on commerce order cancellation record.
    pub order_id: String,

    /// Organization id field on commerce order cancellation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Reason code field on commerce order cancellation record.
    pub reason_code: String,

    /// Reason message field on commerce order cancellation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason_message: Option<String>,

    /// Requested by field on commerce order cancellation record.
    pub requested_by: String,

    /// Status field on commerce order cancellation record.
    pub status: String,

    /// Tenant id field on commerce order cancellation record.
    pub tenant_id: String,
}
