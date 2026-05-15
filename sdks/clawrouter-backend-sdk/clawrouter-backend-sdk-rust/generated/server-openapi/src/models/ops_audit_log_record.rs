use serde::{Deserialize, Serialize};

/// Ops audit log record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsAuditLogRecord {
    /// Action field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub action: Option<String>,

    /// After hash field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub after_hash: Option<String>,

    /// Approval id field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approval_id: Option<String>,

    /// Before hash field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub before_hash: Option<String>,

    /// Change summary field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub change_summary: Option<std::collections::HashMap<String, String>>,

    /// Client ip hash field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip_hash: Option<String>,

    /// Created at field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Operator id field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub operator_id: Option<String>,

    /// Operator name snapshot field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub operator_name_snapshot: Option<String>,

    /// Operator type field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub operator_type: Option<String>,

    /// Organization id field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Request id field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Risk level field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk_level: Option<String>,

    /// Target id field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_id: Option<String>,

    /// Target type field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_type: Option<String>,

    /// Target uuid field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_uuid: Option<String>,

    /// Tenant id field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User agent hash field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_agent_hash: Option<String>,

    /// Uuid field on ops audit log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
