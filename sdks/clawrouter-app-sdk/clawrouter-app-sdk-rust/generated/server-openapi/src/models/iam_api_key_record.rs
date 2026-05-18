use serde::{Deserialize, Serialize};

/// Iam api key record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamApiKeyRecord {
    /// Created at field on iam api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Expires at field on iam api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Id field on iam api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Key hash field on iam api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub key_hash: Option<String>,

    /// Name field on iam api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Permission scope json field on iam api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub permission_scope_json: Option<std::collections::HashMap<String, String>>,

    /// Status field on iam api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on iam api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on iam api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on iam api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
