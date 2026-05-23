use serde::{Deserialize, Serialize};

/// Ai memory space binding record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiMemorySpaceBindingRecord {
    /// Binding id field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub binding_id: Option<String>,

    /// Binding role field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub binding_role: Option<String>,

    /// Binding type field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub binding_type: Option<String>,

    /// Created at field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Enabled field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,

    /// Id field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Memory space id field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_space_id: Option<String>,

    /// Metadata field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Priority field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Status field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai memory space binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
