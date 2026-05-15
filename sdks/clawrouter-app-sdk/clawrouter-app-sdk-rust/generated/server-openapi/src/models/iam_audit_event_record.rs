use serde::{Deserialize, Serialize};

/// Iam audit event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamAuditEventRecord {
    /// Action field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub action: Option<String>,

    /// Actor user id field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub actor_user_id: Option<String>,

    /// App id field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Created at field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Detail json field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub detail_json: Option<std::collections::HashMap<String, String>>,

    /// Environment field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub environment: Option<String>,

    /// Id field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Request id field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Resource id field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_id: Option<String>,

    /// Resource type field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_type: Option<String>,

    /// Sharding key field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sharding_key: Option<String>,

    /// Tenant id field on iam audit event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,
}
