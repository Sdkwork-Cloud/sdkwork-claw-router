use serde::{Deserialize, Serialize};

/// Open platform account record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformAccountRecord {
    /// Account key field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_key: Option<String>,

    /// Account type field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_type: Option<String>,

    /// Aes key ref field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub aes_key_ref: Option<String>,

    /// App id field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Created at field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default entry id field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_entry_id: Option<String>,

    /// Deleted at field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Name field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,

    /// Qr default field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub qr_default: Option<bool>,

    /// Secret ref field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Status field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Token ref field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_ref: Option<String>,

    /// Updated at field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on open platform account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
