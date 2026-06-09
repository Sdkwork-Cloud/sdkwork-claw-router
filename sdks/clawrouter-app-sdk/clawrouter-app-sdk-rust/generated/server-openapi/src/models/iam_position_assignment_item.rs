use serde::{Deserialize, Serialize};

/// Iam position assignment item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamPositionAssignmentItem {
    /// Created at field on iam position assignment item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Department assignment id field on iam position assignment item.
    #[serde(rename = "departmentAssignmentId")]
    pub department_assignment_id: String,

    /// Effective from field on iam position assignment item.
    #[serde(rename = "effectiveFrom")]
    pub effective_from: String,

    /// Effective to field on iam position assignment item.
    #[serde(rename = "effectiveTo")]
    pub effective_to: String,

    /// Id field on iam position assignment item.
    pub id: String,

    /// Is primary field on iam position assignment item.
    #[serde(rename = "isPrimary")]
    pub is_primary: bool,

    /// Organization id field on iam position assignment item.
    #[serde(rename = "organizationId")]
    pub organization_id: String,

    /// Position id field on iam position assignment item.
    #[serde(rename = "positionId")]
    pub position_id: String,

    /// Status field on iam position assignment item.
    pub status: String,

    /// Tenant id field on iam position assignment item.
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    /// Updated at field on iam position assignment item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// User id field on iam position assignment item.
    #[serde(rename = "userId")]
    pub user_id: String,
}
