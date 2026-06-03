use serde::{Deserialize, Serialize};

/// Ai model mapping rule item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelMappingRuleItemRecord {
    /// Created at field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Enabled field on ai model mapping rule item record.
    pub enabled: bool,

    /// Id field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai model mapping rule item record.
    pub organization_id: String,

    /// Rule id field on ai model mapping rule item record.
    pub rule_id: String,

    /// Rule uuid field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule_uuid: Option<String>,

    /// Sort order field on ai model mapping rule item record.
    pub sort_order: i64,

    /// Source catalog key field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_catalog_key: Option<String>,

    /// Source model field on ai model mapping rule item record.
    pub source_model: String,

    /// Status field on ai model mapping rule item record.
    pub status: String,

    /// Target catalog key field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_catalog_key: Option<String>,

    /// Target model field on ai model mapping rule item record.
    pub target_model: String,

    /// Target provider model field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_provider_model: Option<String>,

    /// Target provider native model field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_provider_native_model: Option<String>,

    /// Tenant id field on ai model mapping rule item record.
    pub tenant_id: String,

    /// Updated at field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai model mapping rule item record.
    pub uuid: String,

    /// Version field on ai model mapping rule item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
