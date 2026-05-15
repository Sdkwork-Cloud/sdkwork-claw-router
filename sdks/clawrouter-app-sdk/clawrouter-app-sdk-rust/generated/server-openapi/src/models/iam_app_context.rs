use serde::{Deserialize, Serialize};

/// Iam app context schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamAppContext {
    /// App id field on iam app context.
    #[serde(rename = "appId")]
    pub app_id: String,

    /// Auth level field on iam app context.
    #[serde(rename = "authLevel")]
    pub auth_level: String,

    /// Data scope field on iam app context.
    #[serde(rename = "dataScope")]
    pub data_scope: Vec<String>,

    /// Deployment mode field on iam app context.
    #[serde(rename = "deploymentMode")]
    pub deployment_mode: String,

    /// Environment field on iam app context.
    pub environment: String,

    /// Organization id field on iam app context.
    #[serde(rename = "organizationId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Permission scope field on iam app context.
    #[serde(rename = "permissionScope")]
    pub permission_scope: Vec<String>,

    /// Session id field on iam app context.
    #[serde(rename = "sessionId")]
    pub session_id: String,

    /// Tenant id field on iam app context.
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    /// User id field on iam app context.
    #[serde(rename = "userId")]
    pub user_id: String,
}
