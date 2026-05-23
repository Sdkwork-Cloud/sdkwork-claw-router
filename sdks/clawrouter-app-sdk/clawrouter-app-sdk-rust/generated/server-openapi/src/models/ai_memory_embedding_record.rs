use serde::{Deserialize, Serialize};

/// Ai memory embedding record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiMemoryEmbeddingRecord {
    /// Content hash field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_hash: Option<String>,

    /// Created at field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Embedding dimensions field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub embedding_dimensions: Option<i64>,

    /// Embedding model field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub embedding_model: Option<String>,

    /// Embedding provider field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub embedding_provider: Option<String>,

    /// Id field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Indexed at field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub indexed_at: Option<String>,

    /// Memory id field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_id: Option<String>,

    /// Metadata field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Status field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Vector json field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vector_json: Option<std::collections::HashMap<String, String>>,

    /// Vector storage key field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vector_storage_key: Option<String>,

    /// Version field on ai memory embedding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
