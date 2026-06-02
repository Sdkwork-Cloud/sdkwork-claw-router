use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Plus app record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusAppRecord {
    /// Access url field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub access_url: Option<String>,

    /// App type field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_type: Option<String>,

    /// Artifact field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact: Option<MediaResource>,

    /// Bundle id field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bundle_id: Option<String>,

    /// Config field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config: Option<std::collections::HashMap<String, String>>,

    /// Created at field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<i64>,

    /// Description field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Icon field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<MediaResource>,

    /// Id field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Install config field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub install_config: Option<std::collections::HashMap<String, String>>,

    /// Install platforms field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub install_platforms: Option<std::collections::HashMap<String, String>>,

    /// Install skill field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub install_skill: Option<std::collections::HashMap<String, String>>,

    /// Name field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

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

    /// Status field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<i64>,

    /// Store url field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub store_url: Option<String>,

    /// Tenant id field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// V field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub v: Option<String>,

    /// Version field on plus app record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
