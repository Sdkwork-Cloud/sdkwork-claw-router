use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Admin skill create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillCreateRequest {
    /// Builtin field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub builtin: Option<bool>,

    /// Capabilities field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<Vec<String>>,

    /// Category id field on admin skill create request.
    #[serde(rename = "categoryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Config schema field on admin skill create request.
    #[serde(rename = "configSchema")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config_schema: Option<std::collections::HashMap<String, String>>,

    /// Cover field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover: Option<MediaResource>,

    /// Currency field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Default config field on admin skill create request.
    #[serde(rename = "defaultConfig")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_config: Option<std::collections::HashMap<String, String>>,

    /// Description field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Documentation url field on admin skill create request.
    #[serde(rename = "documentationUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub documentation_url: Option<String>,

    /// Enabled field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,

    /// Entrypoint field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub entrypoint: Option<String>,

    /// Featured field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub featured: Option<bool>,

    /// Homepage url field on admin skill create request.
    #[serde(rename = "homepageUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub homepage_url: Option<String>,

    /// Icon field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<MediaResource>,

    /// Is builtin field on admin skill create request.
    #[serde(rename = "isBuiltin")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub is_builtin: Option<bool>,

    /// License name field on admin skill create request.
    #[serde(rename = "licenseName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license_name: Option<String>,

    /// Manifest url field on admin skill create request.
    #[serde(rename = "manifestUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub manifest_url: Option<String>,

    /// Market status field on admin skill create request.
    #[serde(rename = "marketStatus")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub market_status: Option<String>,

    /// Name field on admin skill create request.
    pub name: String,

    /// Package id field on admin skill create request.
    #[serde(rename = "packageId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_id: Option<String>,

    /// Price field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price: Option<String>,

    /// Provider field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,

    /// Recommend weight field on admin skill create request.
    #[serde(rename = "recommendWeight")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recommend_weight: Option<i64>,

    /// Repository url field on admin skill create request.
    #[serde(rename = "repositoryUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub repository_url: Option<String>,

    /// Review status field on admin skill create request.
    #[serde(rename = "reviewStatus")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_status: Option<String>,

    /// Runtime field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Skill key field on admin skill create request.
    #[serde(rename = "skillKey")]
    pub skill_key: String,

    /// Source type field on admin skill create request.
    #[serde(rename = "sourceType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Summary field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tags field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,

    /// Version field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Version name field on admin skill create request.
    #[serde(rename = "versionName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_name: Option<String>,

    /// Visibility field on admin skill create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub visibility: Option<String>,
}
