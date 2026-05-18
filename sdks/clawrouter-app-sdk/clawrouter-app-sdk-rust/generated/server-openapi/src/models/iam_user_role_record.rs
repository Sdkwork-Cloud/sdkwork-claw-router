use serde::{Deserialize, Serialize};

/// Iam user role record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamUserRoleRecord {
    /// Created at field on iam user role record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on iam user role record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on iam user role record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Role id field on iam user role record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub role_id: Option<String>,

    /// Tenant id field on iam user role record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// User id field on iam user role record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
