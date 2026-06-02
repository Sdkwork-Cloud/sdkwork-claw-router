use serde::{Deserialize, Serialize};

/// Commerce refund event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRefundEventRecord {
    /// Actor id field on commerce refund event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub actor_id: Option<String>,

    /// Actor type field on commerce refund event record.
    pub actor_type: String,

    /// Created at field on commerce refund event record.
    pub created_at: String,

    /// Event no field on commerce refund event record.
    pub event_no: String,

    /// Event type field on commerce refund event record.
    pub event_type: String,

    /// From status field on commerce refund event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub from_status: Option<String>,

    /// Id field on commerce refund event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce refund event record.
    pub idempotency_key: String,

    /// Message field on commerce refund event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Organization id field on commerce refund event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload json field on commerce refund event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_json: Option<std::collections::HashMap<String, String>>,

    /// Reason code field on commerce refund event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason_code: Option<String>,

    /// Refund id field on commerce refund event record.
    pub refund_id: String,

    /// Request id field on commerce refund event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Tenant id field on commerce refund event record.
    pub tenant_id: String,

    /// To status field on commerce refund event record.
    pub to_status: String,
}
