use serde::{Deserialize, Serialize};

/// Iam department tree item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamDepartmentTreeItem {
    /// Children field on iam department tree item.
    pub children: Vec<std::collections::HashMap<String, String>>,

    /// Code field on iam department tree item.
    pub code: String,

    /// Created at field on iam department tree item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Id field on iam department tree item.
    pub id: String,

    /// Name field on iam department tree item.
    pub name: String,

    /// Organization id field on iam department tree item.
    #[serde(rename = "organizationId")]
    pub organization_id: String,

    /// Parent department id field on iam department tree item.
    #[serde(rename = "parentDepartmentId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_department_id: Option<String>,

    /// Path field on iam department tree item.
    pub path: String,

    /// Status field on iam department tree item.
    pub status: String,

    /// Tenant id field on iam department tree item.
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    /// Updated at field on iam department tree item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
