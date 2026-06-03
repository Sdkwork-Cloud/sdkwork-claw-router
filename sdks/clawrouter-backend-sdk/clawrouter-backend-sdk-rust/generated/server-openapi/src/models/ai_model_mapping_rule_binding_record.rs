use serde::{Deserialize, Serialize};

/// Ai model mapping rule binding record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelMappingRuleBindingRecord {
    /// Binding code field on ai model mapping rule binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub binding_code: Option<String>,

    /// Binding id field on ai model mapping rule binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub binding_id: Option<String>,

    /// Binding name snapshot field on ai model mapping rule binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub binding_name_snapshot: Option<String>,

    /// Binding type field on ai model mapping rule binding record.
    pub binding_type: String,

    /// Created at field on ai model mapping rule binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai model mapping rule binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai model mapping rule binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai model mapping rule binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Enabled field on ai model mapping rule binding record.
    pub enabled: bool,

    /// Id field on ai model mapping rule binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai model mapping rule binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai model mapping rule binding record.
    pub organization_id: String,

    /// Rule id field on ai model mapping rule binding record.
    pub rule_id: String,

    /// Rule uuid field on ai model mapping rule binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule_uuid: Option<String>,

    /// Sort order field on ai model mapping rule binding record.
    pub sort_order: i64,

    /// Status field on ai model mapping rule binding record.
    pub status: String,

    /// Tenant id field on ai model mapping rule binding record.
    pub tenant_id: String,

    /// Updated at field on ai model mapping rule binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai model mapping rule binding record.
    pub uuid: String,

    /// Version field on ai model mapping rule binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
