use serde::{Deserialize, Serialize};

/// Content openapi snapshot record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ContentOpenapiSnapshotRecord {
    /// Api surface field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_surface: Option<String>,

    /// Api system field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_system: Option<String>,

    /// Category tree field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_tree: Option<std::collections::HashMap<String, String>>,

    /// Created at field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Endpoint count field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub endpoint_count: Option<i64>,

    /// Example manifest field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub example_manifest: Option<std::collections::HashMap<String, String>>,

    /// Id field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Openapi hash field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub openapi_hash: Option<String>,

    /// Organization id field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Published at field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Rebuild version field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Source id field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source ref field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_ref: Option<String>,

    /// Source type field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source version field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Status field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on content openapi snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
