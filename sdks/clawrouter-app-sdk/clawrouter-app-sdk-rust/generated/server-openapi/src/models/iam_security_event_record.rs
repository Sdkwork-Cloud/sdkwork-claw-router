use serde::{Deserialize, Serialize};

/// Iam security event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamSecurityEventRecord {
    /// Created at field on iam security event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Detail json field on iam security event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub detail_json: Option<std::collections::HashMap<String, String>>,

    /// Event type field on iam security event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_type: Option<String>,

    /// Id field on iam security event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Session id field on iam security event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub session_id: Option<String>,

    /// Severity field on iam security event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub severity: Option<String>,

    /// Tenant id field on iam security event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// User id field on iam security event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
