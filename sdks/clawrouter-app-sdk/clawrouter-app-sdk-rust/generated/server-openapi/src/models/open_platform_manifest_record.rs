use serde::{Deserialize, Serialize};

/// Open platform manifest record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformManifestRecord {
    /// Account type field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_type: Option<String>,

    /// Callback schema field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub callback_schema: Option<std::collections::HashMap<String, String>>,

    /// Capability schema field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability_schema: Option<std::collections::HashMap<String, String>>,

    /// Created at field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Entry schema field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub entry_schema: Option<std::collections::HashMap<String, String>>,

    /// Id field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Manifest key field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub manifest_key: Option<String>,

    /// Metadata field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,

    /// Sort order field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on open platform manifest record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
