use serde::{Deserialize, Serialize};

/// Ai memory entry record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiMemoryEntryRecord {
    /// Confidence score field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub confidence_score: Option<String>,

    /// Content json field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_json: Option<std::collections::HashMap<String, String>>,

    /// Content text field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_text: Option<String>,

    /// Created at field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Created by field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// Data scope field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Expires at field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Id field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Importance score field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub importance_score: Option<String>,

    /// Last recalled at field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_recalled_at: Option<String>,

    /// Memory code field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_code: Option<String>,

    /// Memory type field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_type: Option<String>,

    /// Metadata field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Recall count field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recall_count: Option<String>,

    /// Sensitivity level field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sensitivity_level: Option<String>,

    /// Source conversation id field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_conversation_id: Option<String>,

    /// Source invocation id field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_invocation_id: Option<String>,

    /// Source item id field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_item_id: Option<String>,

    /// Source kind field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_kind: Option<String>,

    /// Source turn id field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_turn_id: Option<String>,

    /// Space id field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub space_id: Option<String>,

    /// Status field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Subject key field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_key: Option<String>,

    /// Subject type field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_type: Option<String>,

    /// Supersedes memory id field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supersedes_memory_id: Option<String>,

    /// Tenant id field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trust level field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trust_level: Option<String>,

    /// Updated at field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Valid from field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub valid_from: Option<String>,

    /// Valid until field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub valid_until: Option<String>,

    /// Version field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Version no field on ai memory entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_no: Option<String>,
}
