use serde::{Deserialize, Serialize};

/// Ai resource group item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiResourceGroupItemRecord {
    /// Child resource group code field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub child_resource_group_code: Option<String>,

    /// Child resource group id field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub child_resource_group_id: Option<String>,

    /// Created at field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Item role field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub item_role: Option<String>,

    /// Item type field on ai resource group item record.
    pub item_type: String,

    /// Metadata field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai resource group item record.
    pub organization_id: String,

    /// Resource code field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_code: Option<String>,

    /// Resource group code field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_group_code: Option<String>,

    /// Resource group id field on ai resource group item record.
    pub resource_group_id: String,

    /// Resource id field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_id: Option<String>,

    /// Sort order field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai resource group item record.
    pub status: String,

    /// Tenant id field on ai resource group item record.
    pub tenant_id: String,

    /// Updated at field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai resource group item record.
    pub uuid: String,

    /// Version field on ai resource group item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
