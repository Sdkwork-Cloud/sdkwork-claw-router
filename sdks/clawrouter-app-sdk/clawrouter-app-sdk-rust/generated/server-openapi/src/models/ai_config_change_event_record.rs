use serde::{Deserialize, Serialize};

/// Ai config change event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiConfigChangeEventRecord {
    /// Changed object id field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub changed_object_id: Option<String>,

    /// Changed object type field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub changed_object_type: Option<String>,

    /// Config scope field on ai config change event record.
    pub config_scope: String,

    /// Config version field on ai config change event record.
    pub config_version: String,

    /// Created at field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Event payload field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_payload: Option<std::collections::HashMap<String, String>>,

    /// Event status field on ai config change event record.
    pub event_status: String,

    /// Id field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last error message field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_error_message: Option<String>,

    /// Legal hold field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai config change event record.
    pub organization_id: String,

    /// Payload hash field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Publish attempts field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub publish_attempts: Option<i64>,

    /// Published at field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Request id field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Status field on ai config change event record.
    pub status: String,

    /// Tenant id field on ai config change event record.
    pub tenant_id: String,

    /// Trace id field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on ai config change event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai config change event record.
    pub uuid: String,
}
