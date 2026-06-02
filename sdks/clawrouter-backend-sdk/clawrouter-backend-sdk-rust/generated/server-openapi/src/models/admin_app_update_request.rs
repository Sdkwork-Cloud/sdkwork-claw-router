use serde::{Deserialize, Serialize};

use crate::models::{AdminAppConfig, MediaResource};

/// Admin app update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppUpdateRequest {
    /// Access url field on admin app update request.
    #[serde(rename = "accessUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub access_url: Option<String>,

    /// App type field on admin app update request.
    #[serde(rename = "appType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_type: Option<String>,

    /// Artifact field on admin app update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact: Option<MediaResource>,

    /// Bundle id field on admin app update request.
    #[serde(rename = "bundleId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bundle_id: Option<String>,

    /// Config field on admin app update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config: Option<AdminAppConfig>,

    /// Description field on admin app update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Icon field on admin app update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<MediaResource>,

    /// Install config field on admin app update request.
    #[serde(rename = "installConfig")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub install_config: Option<std::collections::HashMap<String, String>>,

    /// Install platforms field on admin app update request.
    #[serde(rename = "installPlatforms")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub install_platforms: Option<std::collections::HashMap<String, String>>,

    /// Install skill field on admin app update request.
    #[serde(rename = "installSkill")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub install_skill: Option<std::collections::HashMap<String, String>>,

    /// Name field on admin app update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Package name field on admin app update request.
    #[serde(rename = "packageName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_name: Option<String>,

    /// Platforms field on admin app update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub platforms: Option<std::collections::HashMap<String, String>>,

    /// Project id field on admin app update request.
    #[serde(rename = "projectId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub project_id: Option<String>,

    /// Release notes field on admin app update request.
    #[serde(rename = "releaseNotes")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub release_notes: Option<Vec<std::collections::HashMap<String, String>>>,

    /// Resource list field on admin app update request.
    #[serde(rename = "resourceList")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_list: Option<std::collections::HashMap<String, String>>,

    /// Store url field on admin app update request.
    #[serde(rename = "storeUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub store_url: Option<String>,

    /// User id field on admin app update request.
    #[serde(rename = "userId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Version field on admin app update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
