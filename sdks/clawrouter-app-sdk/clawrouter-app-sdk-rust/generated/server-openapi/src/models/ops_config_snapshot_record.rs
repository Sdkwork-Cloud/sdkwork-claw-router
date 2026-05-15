use serde::{Deserialize, Serialize};

/// Ops config snapshot record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsConfigSnapshotRecord {
    /// Config hash field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config_hash: Option<String>,

    /// Config payload field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config_payload: Option<std::collections::HashMap<String, String>>,

    /// Config scope field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config_scope: Option<String>,

    /// Config type field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config_type: Option<String>,

    /// Created at field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Published at field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Published by field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_by: Option<String>,

    /// Request id field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Rollback from snapshot id field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rollback_from_snapshot_id: Option<String>,

    /// Snapshot no field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub snapshot_no: Option<String>,

    /// Source ids field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_ids: Option<std::collections::HashMap<String, String>>,

    /// Source table field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_table: Option<String>,

    /// Status field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ops config snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
