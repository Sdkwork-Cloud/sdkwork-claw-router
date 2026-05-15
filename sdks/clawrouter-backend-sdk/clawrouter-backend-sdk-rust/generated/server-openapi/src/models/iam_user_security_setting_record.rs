use serde::{Deserialize, Serialize};

/// Iam user security setting record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamUserSecuritySettingRecord {
    /// Created at field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last login at field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_login_at: Option<String>,

    /// Last login ip hash field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_login_ip_hash: Option<String>,

    /// Metadata field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Mfa enabled field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mfa_enabled: Option<bool>,

    /// Mfa method field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mfa_method: Option<String>,

    /// Organization id field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Password last changed at field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub password_last_changed_at: Option<String>,

    /// Security level field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub security_level: Option<String>,

    /// Status field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Third party bound snapshot field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub third_party_bound_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Trusted device count field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trusted_device_count: Option<i64>,

    /// Updated at field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on iam user security setting record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
