use serde::{Deserialize, Serialize};

/// Iam credential record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamCredentialRecord {
    /// Created at field on iam credential record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Credential hash field on iam credential record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_hash: Option<String>,

    /// Credential type field on iam credential record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_type: Option<String>,

    /// Expires at field on iam credential record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Id field on iam credential record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Status field on iam credential record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on iam credential record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on iam credential record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on iam credential record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
