use serde::{Deserialize, Serialize};

/// Plus app record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusAppRecord {
    /// Access url field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub access_url: Option<String>,

    /// App type field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_type: Option<String>,

    /// Bundle id field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bundle_id: Option<String>,

    /// Description field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Download url field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub download_url: Option<String>,

    /// Icon field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<std::collections::HashMap<String, String>>,

    /// Icon url field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon_url: Option<String>,

    /// Install config field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub install_config: Option<std::collections::HashMap<String, String>>,

    /// Install platforms field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub install_platforms: Option<std::collections::HashMap<String, String>>,

    /// Install skill field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub install_skill: Option<std::collections::HashMap<String, String>>,

    /// Package name field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_name: Option<String>,

    /// Platforms field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub platforms: Option<std::collections::HashMap<String, String>>,

    /// Project id field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub project_id: Option<String>,

    /// Release notes field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub release_notes: Option<std::collections::HashMap<String, String>>,

    /// Resource list field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_list: Option<std::collections::HashMap<String, String>>,

    /// Store url field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub store_url: Option<String>,

    /// User id field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Version field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
