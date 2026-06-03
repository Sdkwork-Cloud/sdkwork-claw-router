use serde::{Deserialize, Serialize};

/// Ai model mapping rule record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelMappingRuleRecord {
    /// Created at field on ai model mapping rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai model mapping rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai model mapping rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai model mapping rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Enabled field on ai model mapping rule record.
    pub enabled: bool,

    /// Id field on ai model mapping rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Mapping mode field on ai model mapping rule record.
    pub mapping_mode: String,

    /// Match type field on ai model mapping rule record.
    pub match_type: String,

    /// Metadata field on ai model mapping rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai model mapping rule record.
    pub organization_id: String,

    /// Source vendor code field on ai model mapping rule record.
    pub source_vendor_code: String,

    /// Source vendor id field on ai model mapping rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_vendor_id: Option<String>,

    /// Status field on ai model mapping rule record.
    pub status: String,

    /// Target vendor code field on ai model mapping rule record.
    pub target_vendor_code: String,

    /// Target vendor id field on ai model mapping rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_vendor_id: Option<String>,

    /// Tenant id field on ai model mapping rule record.
    pub tenant_id: String,

    /// Updated at field on ai model mapping rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai model mapping rule record.
    pub uuid: String,

    /// Version field on ai model mapping rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
