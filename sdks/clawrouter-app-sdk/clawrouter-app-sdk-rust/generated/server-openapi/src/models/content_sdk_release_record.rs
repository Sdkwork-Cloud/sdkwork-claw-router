use serde::{Deserialize, Serialize};

/// Content sdk release record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ContentSdkReleaseRecord {
    /// Api system field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_system: Option<String>,

    /// Artifact manifest field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_manifest: Option<std::collections::HashMap<String, String>>,

    /// Created at field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default base url field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_base_url: Option<String>,

    /// Deleted at field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Docs url field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub docs_url: Option<String>,

    /// Example code field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub example_code: Option<String>,

    /// Example manifest field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub example_manifest: Option<std::collections::HashMap<String, String>>,

    /// Github url field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub github_url: Option<String>,

    /// Id field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Import code field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub import_code: Option<String>,

    /// Init code field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub init_code: Option<String>,

    /// Install command field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub install_command: Option<String>,

    /// Language field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,

    /// Language description field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub language_description: Option<String>,

    /// Language icon field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub language_icon: Option<String>,

    /// Metadata field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Openapi snapshot id field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub openapi_snapshot_id: Option<String>,

    /// Organization id field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Package manager field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_manager: Option<String>,

    /// Package name field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_name: Option<String>,

    /// Published at field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Source repo field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_repo: Option<String>,

    /// Status field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on content sdk release record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
