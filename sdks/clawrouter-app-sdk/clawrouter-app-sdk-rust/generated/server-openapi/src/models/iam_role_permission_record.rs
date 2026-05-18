use serde::{Deserialize, Serialize};

/// Iam role permission record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamRolePermissionRecord {
    /// Created at field on iam role permission record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on iam role permission record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Permission id field on iam role permission record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub permission_id: Option<String>,

    /// Role id field on iam role permission record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub role_id: Option<String>,

    /// Tenant id field on iam role permission record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,
}
