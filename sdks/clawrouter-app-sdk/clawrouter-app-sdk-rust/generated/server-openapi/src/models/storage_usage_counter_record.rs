use serde::{Deserialize, Serialize};

/// Storage usage counter record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StorageUsageCounterRecord {
    /// App id field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Business domain field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub business_domain: Option<String>,

    /// Created at field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// File count field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_count: Option<String>,

    /// Id field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last ledger id field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_ledger_id: Option<String>,

    /// Metadata field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Reserved bytes field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reserved_bytes: Option<String>,

    /// Retained bytes field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retained_bytes: Option<String>,

    /// Scope id field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scope_id: Option<String>,

    /// Scope type field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scope_type: Option<String>,

    /// Space id field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub space_id: Option<String>,

    /// Status field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trash bytes field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trash_bytes: Option<String>,

    /// Updated at field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Used logical bytes field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub used_logical_bytes: Option<String>,

    /// Used physical bytes field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub used_physical_bytes: Option<String>,

    /// User id field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on storage usage counter record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
