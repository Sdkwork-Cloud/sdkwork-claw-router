use serde::{Deserialize, Serialize};

/// Iam role binding item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamRoleBindingItem {
    /// Condition json field on iam role binding item.
    #[serde(rename = "conditionJson")]
    pub condition_json: String,

    /// Created at field on iam role binding item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Effect field on iam role binding item.
    pub effect: String,

    /// Id field on iam role binding item.
    pub id: String,

    /// Principal id field on iam role binding item.
    #[serde(rename = "principalId")]
    pub principal_id: String,

    /// Principal kind field on iam role binding item.
    #[serde(rename = "principalKind")]
    pub principal_kind: String,

    /// Role id field on iam role binding item.
    #[serde(rename = "roleId")]
    pub role_id: String,

    /// Scope id field on iam role binding item.
    #[serde(rename = "scopeId")]
    pub scope_id: String,

    /// Scope kind field on iam role binding item.
    #[serde(rename = "scopeKind")]
    pub scope_kind: String,

    /// Status field on iam role binding item.
    pub status: String,

    /// Tenant id field on iam role binding item.
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    /// Updated at field on iam role binding item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
