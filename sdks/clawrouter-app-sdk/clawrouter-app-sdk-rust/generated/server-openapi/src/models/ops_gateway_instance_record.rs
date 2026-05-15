use serde::{Deserialize, Serialize};

/// Ops gateway instance record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsGatewayInstanceRecord {
    /// Cell field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cell: Option<String>,

    /// Config hash field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config_hash: Option<String>,

    /// Container id hash field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub container_id_hash: Option<String>,

    /// Created at field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Deployment mode field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deployment_mode: Option<String>,

    /// Desktop device hash field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub desktop_device_hash: Option<String>,

    /// Health status field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Host name field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub host_name: Option<String>,

    /// Id field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Instance code field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub instance_code: Option<String>,

    /// Ip address hash field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ip_address_hash: Option<String>,

    /// Ip address masked field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ip_address_masked: Option<String>,

    /// Last heartbeat at field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_heartbeat_at: Option<String>,

    /// Metadata field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Node name field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub node_name: Option<String>,

    /// Orchestrator field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub orchestrator: Option<String>,

    /// Organization id field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Pod name field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pod_name: Option<String>,

    /// Region field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region: Option<String>,

    /// Runtime type field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_type: Option<String>,

    /// Started at field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Version name field on ops gateway instance record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_name: Option<String>,
}
