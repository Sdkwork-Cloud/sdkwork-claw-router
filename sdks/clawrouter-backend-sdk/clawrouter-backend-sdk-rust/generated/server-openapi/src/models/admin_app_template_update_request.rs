use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Admin app template update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppTemplateUpdateRequest {
    /// App config schema field on admin app template update request.
    #[serde(rename = "appConfigSchema")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_config_schema: Option<std::collections::HashMap<String, String>>,

    /// Capability manifest field on admin app template update request.
    #[serde(rename = "capabilityManifest")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability_manifest: Option<Vec<std::collections::HashMap<String, String>>>,

    /// Category code field on admin app template update request.
    #[serde(rename = "categoryCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_code: Option<String>,

    /// Category id field on admin app template update request.
    #[serde(rename = "categoryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Cover field on admin app template update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover: Option<MediaResource>,

    /// Default app config field on admin app template update request.
    #[serde(rename = "defaultAppConfig")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_app_config: Option<std::collections::HashMap<String, String>>,

    /// Dependency manifest field on admin app template update request.
    #[serde(rename = "dependencyManifest")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub dependency_manifest: Option<Vec<std::collections::HashMap<String, String>>>,

    /// Description field on admin app template update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Featured field on admin app template update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub featured: Option<bool>,

    /// Framework field on admin app template update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub framework: Option<String>,

    /// Git ref field on admin app template update request.
    #[serde(rename = "gitRef")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub git_ref: Option<String>,

    /// Git repo url field on admin app template update request.
    #[serde(rename = "gitRepoUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub git_repo_url: Option<String>,

    /// Git sub path field on admin app template update request.
    #[serde(rename = "gitSubPath")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub git_sub_path: Option<String>,

    /// Icon field on admin app template update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<MediaResource>,

    /// Language field on admin app template update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,

    /// Publish status field on admin app template update request.
    #[serde(rename = "publishStatus")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub publish_status: Option<String>,

    /// Runtime field on admin app template update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Sort weight field on admin app template update request.
    #[serde(rename = "sortWeight")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_weight: Option<i64>,

    /// Source app id field on admin app template update request.
    #[serde(rename = "sourceAppId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_app_id: Option<String>,

    /// Template name field on admin app template update request.
    #[serde(rename = "templateName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_name: Option<String>,

    /// Template type field on admin app template update request.
    #[serde(rename = "templateType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_type: Option<String>,

    /// Variable schema field on admin app template update request.
    #[serde(rename = "variableSchema")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub variable_schema: Option<std::collections::HashMap<String, String>>,

    /// Visibility field on admin app template update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub visibility: Option<String>,
}
