use serde::{Deserialize, Serialize};

/// Iam session record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamSessionRecord {
    /// Access token hash field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub access_token_hash: Option<String>,

    /// App id field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Auth level field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_level: Option<String>,

    /// Auth token hash field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_token_hash: Option<String>,

    /// Created at field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope json field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope_json: Option<std::collections::HashMap<String, String>>,

    /// Deployment mode field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deployment_mode: Option<String>,

    /// Environment field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub environment: Option<String>,

    /// Expires at field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Id field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Permission scope json field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub permission_scope_json: Option<std::collections::HashMap<String, String>>,

    /// Refresh token hash field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub refresh_token_hash: Option<String>,

    /// Revoked at field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub revoked_at: Option<String>,

    /// Sharding key field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sharding_key: Option<String>,

    /// Sharding strategy field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sharding_strategy: Option<String>,

    /// Tenant id field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on iam session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
