use serde::{Deserialize, Serialize};

/// Iam organization membership item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamOrganizationMembershipItem {
    /// Id field on iam organization membership item.
    pub id: String,

    /// Joined at field on iam organization membership item.
    #[serde(rename = "joinedAt")]
    pub joined_at: String,

    /// Left at field on iam organization membership item.
    #[serde(rename = "leftAt")]
    pub left_at: String,

    /// Organization id field on iam organization membership item.
    #[serde(rename = "organizationId")]
    pub organization_id: String,

    /// Remark field on iam organization membership item.
    pub remark: String,

    /// Role code field on iam organization membership item.
    #[serde(rename = "roleCode")]
    pub role_code: String,

    /// Status field on iam organization membership item.
    pub status: String,

    /// Tenant id field on iam organization membership item.
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    /// User id field on iam organization membership item.
    #[serde(rename = "userId")]
    pub user_id: String,
}
