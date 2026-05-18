use serde::{Deserialize, Serialize};

/// Iam mfa factor record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamMfaFactorRecord {
    /// Created at field on iam mfa factor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Factor type field on iam mfa factor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub factor_type: Option<String>,

    /// Id field on iam mfa factor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Secret ref field on iam mfa factor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Status field on iam mfa factor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on iam mfa factor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on iam mfa factor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on iam mfa factor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
