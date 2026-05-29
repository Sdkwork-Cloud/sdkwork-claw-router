use serde::{Deserialize, Serialize};

/// Ai resource group record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiResourceGroupRecord {
    /// Created at field on ai resource group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai resource group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai resource group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai resource group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai resource group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Group code field on ai resource group record.
    pub group_code: String,

    /// Group name field on ai resource group record.
    pub group_name: String,

    /// Group type field on ai resource group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub group_type: Option<String>,

    /// Id field on ai resource group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai resource group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai resource group record.
    pub organization_id: String,

    /// Selection mode field on ai resource group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub selection_mode: Option<String>,

    /// Sort order field on ai resource group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai resource group record.
    pub status: String,

    /// Tenant id field on ai resource group record.
    pub tenant_id: String,

    /// Updated at field on ai resource group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai resource group record.
    pub uuid: String,

    /// Version field on ai resource group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
