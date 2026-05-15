use serde::{Deserialize, Serialize};

/// Iam organization member record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamOrganizationMemberRecord {
    /// Id field on iam organization member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Joined at field on iam organization member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub joined_at: Option<String>,

    /// Organization id field on iam organization member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Role code field on iam organization member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub role_code: Option<String>,

    /// Status field on iam organization member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on iam organization member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// User id field on iam organization member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
