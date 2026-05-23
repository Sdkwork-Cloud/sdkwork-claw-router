use serde::{Deserialize, Serialize};

/// Commerce invoice event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInvoiceEventRecord {
    /// Actor id field on commerce invoice event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub actor_id: Option<String>,

    /// Actor type field on commerce invoice event record.
    pub actor_type: String,

    /// Created at field on commerce invoice event record.
    pub created_at: String,

    /// Event no field on commerce invoice event record.
    pub event_no: String,

    /// Event type field on commerce invoice event record.
    pub event_type: String,

    /// From status field on commerce invoice event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub from_status: Option<String>,

    /// Idempotency key field on commerce invoice event record.
    pub idempotency_key: String,

    /// Invoice id field on commerce invoice event record.
    pub invoice_id: String,

    /// Message field on commerce invoice event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Organization id field on commerce invoice event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload json field on commerce invoice event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_json: Option<std::collections::HashMap<String, String>>,

    /// Reason code field on commerce invoice event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason_code: Option<String>,

    /// Request id field on commerce invoice event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Tenant id field on commerce invoice event record.
    pub tenant_id: String,

    /// To status field on commerce invoice event record.
    pub to_status: String,
}
