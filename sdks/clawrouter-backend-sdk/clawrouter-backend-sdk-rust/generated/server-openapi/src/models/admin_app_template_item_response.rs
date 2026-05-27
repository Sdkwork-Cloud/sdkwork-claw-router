use serde::{Deserialize, Serialize};

/// Persisted app template snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppTemplateItemResponse {
    /// App config schema field on admin app template item response.
    #[serde(rename = "appConfigSchema")]
    pub app_config_schema: std::collections::HashMap<String, String>,

    /// Capability manifest field on admin app template item response.
    #[serde(rename = "capabilityManifest")]
    pub capability_manifest: Vec<std::collections::HashMap<String, String>>,

    /// Category code field on admin app template item response.
    #[serde(rename = "categoryCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_code: Option<String>,

    /// Category id field on admin app template item response.
    #[serde(rename = "categoryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Cover url field on admin app template item response.
    #[serde(rename = "coverUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover_url: Option<String>,

    /// Created at field on admin app template item response.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Current version id field on admin app template item response.
    #[serde(rename = "currentVersionId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub current_version_id: Option<String>,

    /// Default app config field on admin app template item response.
    #[serde(rename = "defaultAppConfig")]
    pub default_app_config: std::collections::HashMap<String, String>,

    /// Dependency manifest field on admin app template item response.
    #[serde(rename = "dependencyManifest")]
    pub dependency_manifest: Vec<std::collections::HashMap<String, String>>,

    /// Description field on admin app template item response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Featured field on admin app template item response.
    pub featured: bool,

    /// Framework field on admin app template item response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub framework: Option<String>,

    /// Git ref field on admin app template item response.
    #[serde(rename = "gitRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub git_ref: Option<String>,

    /// Git repo url field on admin app template item response.
    #[serde(rename = "gitRepoUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub git_repo_url: Option<String>,

    /// Git sub path field on admin app template item response.
    #[serde(rename = "gitSubPath")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub git_sub_path: Option<String>,

    /// Icon url field on admin app template item response.
    #[serde(rename = "iconUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon_url: Option<String>,

    /// Id field on admin app template item response.
    pub id: String,

    /// Language field on admin app template item response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,

    /// Publish status field on admin app template item response.
    #[serde(rename = "publishStatus")]
    pub publish_status: String,

    /// Runtime field on admin app template item response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Sort weight field on admin app template item response.
    #[serde(rename = "sortWeight")]
    pub sort_weight: i64,

    /// Source app id field on admin app template item response.
    #[serde(rename = "sourceAppId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_app_id: Option<String>,

    /// Template code field on admin app template item response.
    #[serde(rename = "templateCode")]
    pub template_code: String,

    /// Template name field on admin app template item response.
    #[serde(rename = "templateName")]
    pub template_name: String,

    /// Template no field on admin app template item response.
    #[serde(rename = "templateNo")]
    pub template_no: String,

    /// Template type field on admin app template item response.
    #[serde(rename = "templateType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_type: Option<String>,

    /// Updated at field on admin app template item response.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// Uuid field on admin app template item response.
    pub uuid: String,

    /// Variable schema field on admin app template item response.
    #[serde(rename = "variableSchema")]
    pub variable_schema: std::collections::HashMap<String, String>,

    /// Visibility field on admin app template item response.
    pub visibility: String,
}
