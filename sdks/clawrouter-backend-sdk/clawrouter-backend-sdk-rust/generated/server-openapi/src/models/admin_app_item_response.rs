use serde::{Deserialize, Serialize};

use crate::models::{AdminAppConfig};

/// Offline PlusApp snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppItemResponse {
    /// Access url field on admin app item response.
    #[serde(rename = "accessUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub access_url: Option<String>,

    /// App key field on admin app item response.
    #[serde(rename = "appKey")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_key: Option<String>,

    /// App type field on admin app item response.
    #[serde(rename = "appType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_type: Option<String>,

    /// Bundle id field on admin app item response.
    #[serde(rename = "bundleId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bundle_id: Option<String>,

    /// Config field on admin app item response.
    pub config: AdminAppConfig,

    /// Created at field on admin app item response.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Description field on admin app item response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Download url field on admin app item response.
    #[serde(rename = "downloadUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub download_url: Option<String>,

    /// Icon field on admin app item response.
    pub icon: std::collections::HashMap<String, String>,

    /// Icon url field on admin app item response.
    #[serde(rename = "iconUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon_url: Option<String>,

    /// Id field on admin app item response.
    pub id: String,

    /// Install config field on admin app item response.
    #[serde(rename = "installConfig")]
    pub install_config: std::collections::HashMap<String, String>,

    /// Install platforms field on admin app item response.
    #[serde(rename = "installPlatforms")]
    pub install_platforms: std::collections::HashMap<String, String>,

    /// Install skill field on admin app item response.
    #[serde(rename = "installSkill")]
    pub install_skill: std::collections::HashMap<String, String>,

    /// Market status field on admin app item response.
    #[serde(rename = "marketStatus")]
    pub market_status: String,

    /// Name field on admin app item response.
    pub name: String,

    /// Package name field on admin app item response.
    #[serde(rename = "packageName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_name: Option<String>,

    /// Platforms field on admin app item response.
    pub platforms: std::collections::HashMap<String, String>,

    /// Project id field on admin app item response.
    #[serde(rename = "projectId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub project_id: Option<String>,

    /// Release notes field on admin app item response.
    #[serde(rename = "releaseNotes")]
    pub release_notes: Vec<std::collections::HashMap<String, String>>,

    /// Resource list field on admin app item response.
    #[serde(rename = "resourceList")]
    pub resource_list: std::collections::HashMap<String, String>,

    /// Status field on admin app item response.
    pub status: String,

    /// Store url field on admin app item response.
    #[serde(rename = "storeUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub store_url: Option<String>,

    /// Updated at field on admin app item response.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// User id field on admin app item response.
    #[serde(rename = "userId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on admin app item response.
    pub uuid: String,

    /// Version field on admin app item response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
