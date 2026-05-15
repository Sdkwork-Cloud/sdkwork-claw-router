use serde::{Deserialize, Serialize};

/// Ops gateway heartbeat record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsGatewayHeartbeatRecord {
    /// Active connections field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub active_connections: Option<String>,

    /// Cpu percent field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cpu_percent: Option<String>,

    /// Created at field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Disk percent field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub disk_percent: Option<String>,

    /// Heartbeat at field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub heartbeat_at: Option<String>,

    /// Id field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Instance id field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub instance_id: Option<String>,

    /// Legal hold field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Memory percent field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_percent: Option<String>,

    /// Metadata field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Network in bytes field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub network_in_bytes: Option<String>,

    /// Network out bytes field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub network_out_bytes: Option<String>,

    /// Open file count field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub open_file_count: Option<String>,

    /// Organization id field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload: Option<std::collections::HashMap<String, String>>,

    /// Payload hash field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Request id field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Status field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Thread count field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub thread_count: Option<String>,

    /// Trace id field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Uptime seconds field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uptime_seconds: Option<String>,

    /// User id field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ops gateway heartbeat record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
