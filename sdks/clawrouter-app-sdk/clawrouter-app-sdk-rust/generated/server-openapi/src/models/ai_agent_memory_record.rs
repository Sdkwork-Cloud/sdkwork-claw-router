use serde::{Deserialize, Serialize};

/// Ai agent memory record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiAgentMemoryRecord {
    /// Agent id field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<String>,

    /// Content ref field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_ref: Option<String>,

    /// Created at field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Embedding ref field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub embedding_ref: Option<String>,

    /// Expires at field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Id field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last used at field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_used_at: Option<String>,

    /// Memory hash field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_hash: Option<String>,

    /// Memory scope field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_scope: Option<String>,

    /// Memory type field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_type: Option<String>,

    /// Metadata field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Owner user id field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_user_id: Option<String>,

    /// Retention policy field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_policy: Option<std::collections::HashMap<String, String>>,

    /// Status field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai agent memory record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
