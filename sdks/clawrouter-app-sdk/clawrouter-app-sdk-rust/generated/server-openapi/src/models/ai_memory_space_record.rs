use serde::{Deserialize, Serialize};

/// Ai memory space record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiMemorySpaceRecord {
    /// Auto extract enabled field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auto_extract_enabled: Option<bool>,

    /// Auto recall enabled field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auto_recall_enabled: Option<bool>,

    /// Created at field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Entry count field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub entry_count: Option<String>,

    /// Id field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Max injected tokens field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_injected_tokens: Option<String>,

    /// Memory enabled field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_enabled: Option<bool>,

    /// Metadata field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Retention policy field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_policy: Option<std::collections::HashMap<String, String>>,

    /// Review required field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_required: Option<bool>,

    /// Sensitivity policy field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sensitivity_policy: Option<std::collections::HashMap<String, String>>,

    /// Space type field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub space_type: Option<String>,

    /// Status field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai memory space record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
