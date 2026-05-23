use serde::{Deserialize, Serialize};

/// Open platform entry record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformEntryRecord {
    /// Account id field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_id: Option<String>,

    /// Created at field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Entry key field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub entry_key: Option<String>,

    /// Entry type field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub entry_type: Option<String>,

    /// Entry url field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub entry_url: Option<String>,

    /// Id field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Status field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on open platform entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
