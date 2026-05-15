use serde::{Deserialize, Serialize};

/// Content doc page record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ContentDocPageRecord {
    /// Content hash field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_hash: Option<String>,

    /// Content source field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_source: Option<String>,

    /// Created at field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Doc code field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub doc_code: Option<String>,

    /// Doc type field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub doc_type: Option<String>,

    /// Id field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Path field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// Published at field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Slug field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub slug: Option<String>,

    /// Sort order field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Source ref field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_ref: Option<String>,

    /// Status field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Summary field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tenant id field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on content doc page record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
