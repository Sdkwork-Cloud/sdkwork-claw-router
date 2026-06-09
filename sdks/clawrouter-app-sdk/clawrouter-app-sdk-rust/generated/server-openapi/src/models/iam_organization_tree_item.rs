use serde::{Deserialize, Serialize};

/// Iam organization tree item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamOrganizationTreeItem {
    /// Children field on iam organization tree item.
    pub children: Vec<std::collections::HashMap<String, String>>,

    /// Code field on iam organization tree item.
    pub code: String,

    /// Created at field on iam organization tree item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Id field on iam organization tree item.
    pub id: String,

    /// Name field on iam organization tree item.
    pub name: String,

    /// Parent id field on iam organization tree item.
    #[serde(rename = "parentId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Path field on iam organization tree item.
    pub path: String,

    /// Status field on iam organization tree item.
    pub status: String,

    /// Tenant id field on iam organization tree item.
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    /// Updated at field on iam organization tree item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
