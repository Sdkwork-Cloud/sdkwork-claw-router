use serde::{Deserialize, Serialize};

/// Iam department assignment item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamDepartmentAssignmentItem {
    /// Assignment kind field on iam department assignment item.
    #[serde(rename = "assignmentKind")]
    pub assignment_kind: String,

    /// Created at field on iam department assignment item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Department id field on iam department assignment item.
    #[serde(rename = "departmentId")]
    pub department_id: String,

    /// Effective from field on iam department assignment item.
    #[serde(rename = "effectiveFrom")]
    pub effective_from: String,

    /// Effective to field on iam department assignment item.
    #[serde(rename = "effectiveTo")]
    pub effective_to: String,

    /// Id field on iam department assignment item.
    pub id: String,

    /// Is primary field on iam department assignment item.
    #[serde(rename = "isPrimary")]
    pub is_primary: bool,

    /// Organization id field on iam department assignment item.
    #[serde(rename = "organizationId")]
    pub organization_id: String,

    /// Organization membership id field on iam department assignment item.
    #[serde(rename = "organizationMembershipId")]
    pub organization_membership_id: String,

    /// Status field on iam department assignment item.
    pub status: String,

    /// Tenant id field on iam department assignment item.
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    /// Updated at field on iam department assignment item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// User id field on iam department assignment item.
    #[serde(rename = "userId")]
    pub user_id: String,
}
