use serde::{Deserialize, Serialize};

/// Studio app template record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StudioAppTemplateRecord {
    /// App config schema field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_config_schema: Option<std::collections::HashMap<String, String>>,

    /// Capability manifest field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability_manifest: Option<std::collections::HashMap<String, String>>,

    /// Category code field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_code: Option<String>,

    /// Category id field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Cover url field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover_url: Option<String>,

    /// Created at field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Current version id field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub current_version_id: Option<String>,

    /// Data scope field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default app config field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_app_config: Option<std::collections::HashMap<String, String>>,

    /// Deleted at field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Dependency manifest field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub dependency_manifest: Option<std::collections::HashMap<String, String>>,

    /// Deprecated at field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deprecated_at: Option<String>,

    /// Description field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Featured field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub featured: Option<bool>,

    /// Framework field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub framework: Option<String>,

    /// Git ref field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub git_ref: Option<String>,

    /// Git repo url field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub git_repo_url: Option<String>,

    /// Git sub path field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub git_sub_path: Option<String>,

    /// Icon url field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon_url: Option<String>,

    /// Id field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Language field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,

    /// Metadata field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_user_id: Option<String>,

    /// Publish status field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub publish_status: Option<String>,

    /// Published at field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Runtime field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Sort weight field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_weight: Option<i64>,

    /// Source app id field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_app_id: Option<String>,

    /// Status field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Template code field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_code: Option<String>,

    /// Template name field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_name: Option<String>,

    /// Template no field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_no: Option<String>,

    /// Template type field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_type: Option<String>,

    /// Tenant id field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Variable schema field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub variable_schema: Option<std::collections::HashMap<String, String>>,

    /// Version field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Visibility field on studio app template record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub visibility: Option<String>,
}
