use serde::{Deserialize, Serialize};

/// Messaging provider account record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagingProviderAccountRecord {
    /// Auth type field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_type: Option<String>,

    /// Base url field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Created at field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Credential hash field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_hash: Option<String>,

    /// Credential ref field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_ref: Option<String>,

    /// Credential version field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_version: Option<String>,

    /// Data scope field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Delivery purpose field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivery_purpose: Option<String>,

    /// Id field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last used at field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_used_at: Option<String>,

    /// Last verified at field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_verified_at: Option<String>,

    /// Masked label field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub masked_label: Option<String>,

    /// Metadata field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on messaging provider account record.
    pub organization_id: String,

    /// Provider id field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Status field on messaging provider account record.
    pub status: String,

    /// Tenant id field on messaging provider account record.
    pub tenant_id: String,

    /// Updated at field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on messaging provider account record.
    pub uuid: String,

    /// Version field on messaging provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
