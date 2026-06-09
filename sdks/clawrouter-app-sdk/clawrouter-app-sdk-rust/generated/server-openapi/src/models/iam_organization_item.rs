use serde::{Deserialize, Serialize};

/// Iam organization item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamOrganizationItem {
    /// Code field on iam organization item.
    pub code: String,

    /// Created at field on iam organization item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Id field on iam organization item.
    pub id: String,

    /// Name field on iam organization item.
    pub name: String,

    /// Parent id field on iam organization item.
    #[serde(rename = "parentId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Path field on iam organization item.
    pub path: String,

    /// Status field on iam organization item.
    pub status: String,

    /// Tenant id field on iam organization item.
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    /// Updated at field on iam organization item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
