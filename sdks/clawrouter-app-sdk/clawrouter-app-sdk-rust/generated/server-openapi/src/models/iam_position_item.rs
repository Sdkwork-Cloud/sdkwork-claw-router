use serde::{Deserialize, Serialize};

/// Iam position item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamPositionItem {
    /// Code field on iam position item.
    pub code: String,

    /// Created at field on iam position item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Department id field on iam position item.
    #[serde(rename = "departmentId")]
    pub department_id: String,

    /// Id field on iam position item.
    pub id: String,

    /// Name field on iam position item.
    pub name: String,

    /// Organization id field on iam position item.
    #[serde(rename = "organizationId")]
    pub organization_id: String,

    /// Position kind field on iam position item.
    #[serde(rename = "positionKind")]
    pub position_kind: String,

    /// Rank level field on iam position item.
    #[serde(rename = "rankLevel")]
    pub rank_level: String,

    /// Status field on iam position item.
    pub status: String,

    /// Tenant id field on iam position item.
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    /// Updated at field on iam position item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
