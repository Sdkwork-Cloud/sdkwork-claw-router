use serde::{Deserialize, Serialize};

/// Promotion event outbox record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionEventOutboxRecord {
    /// Aggregate id field on promotion event outbox record.
    pub aggregate_id: String,

    /// Aggregate type field on promotion event outbox record.
    pub aggregate_type: String,

    /// Created at field on promotion event outbox record.
    pub created_at: String,

    /// Event no field on promotion event outbox record.
    pub event_no: String,

    /// Event type field on promotion event outbox record.
    pub event_type: String,

    /// Event version field on promotion event outbox record.
    pub event_version: i64,

    /// Id field on promotion event outbox record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Next retry at field on promotion event outbox record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub next_retry_at: Option<String>,

    /// Occurred at field on promotion event outbox record.
    pub occurred_at: String,

    /// Organization id field on promotion event outbox record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on promotion event outbox record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Payload json field on promotion event outbox record.
    pub payload_json: std::collections::HashMap<String, String>,

    /// Publish attempts field on promotion event outbox record.
    pub publish_attempts: i64,

    /// Published at field on promotion event outbox record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Status field on promotion event outbox record.
    pub status: String,

    /// Tenant id field on promotion event outbox record.
    pub tenant_id: String,
}
