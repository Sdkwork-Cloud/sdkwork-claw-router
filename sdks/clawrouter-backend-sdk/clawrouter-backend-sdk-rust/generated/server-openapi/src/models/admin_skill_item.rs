use serde::{Deserialize, Serialize};

/// Offline agent skill snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillItem {
    /// Builtin field on admin skill item.
    pub builtin: bool,

    /// Capabilities field on admin skill item.
    pub capabilities: Vec<String>,

    /// Category id field on admin skill item.
    #[serde(rename = "categoryId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Config schema field on admin skill item.
    #[serde(rename = "configSchema")]
    pub config_schema: std::collections::HashMap<String, String>,

    /// Cover image field on admin skill item.
    #[serde(rename = "coverImage")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover_image: Option<String>,

    /// Created at field on admin skill item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Currency field on admin skill item.
    pub currency: String,

    /// Default config field on admin skill item.
    #[serde(rename = "defaultConfig")]
    pub default_config: std::collections::HashMap<String, String>,

    /// Description field on admin skill item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Documentation url field on admin skill item.
    #[serde(rename = "documentationUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub documentation_url: Option<String>,

    /// Enabled field on admin skill item.
    pub enabled: bool,

    /// Entrypoint field on admin skill item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub entrypoint: Option<String>,

    /// Featured field on admin skill item.
    pub featured: bool,

    /// Homepage url field on admin skill item.
    #[serde(rename = "homepageUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub homepage_url: Option<String>,

    /// Icon field on admin skill item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,

    /// Id field on admin skill item.
    pub id: String,

    /// Install count field on admin skill item.
    #[serde(rename = "installCount")]
    pub install_count: String,

    /// Is builtin field on admin skill item.
    #[serde(rename = "isBuiltin")]
    pub is_builtin: bool,

    /// Latest published at field on admin skill item.
    #[serde(rename = "latestPublishedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latest_published_at: Option<String>,

    /// License name field on admin skill item.
    #[serde(rename = "licenseName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license_name: Option<String>,

    /// Manifest url field on admin skill item.
    #[serde(rename = "manifestUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub manifest_url: Option<String>,

    /// Market status field on admin skill item.
    #[serde(rename = "marketStatus")]
    pub market_status: String,

    /// Name field on admin skill item.
    pub name: String,

    /// Package id field on admin skill item.
    #[serde(rename = "packageId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_id: Option<String>,

    /// Price field on admin skill item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price: Option<String>,

    /// Provider field on admin skill item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,

    /// Rating avg field on admin skill item.
    #[serde(rename = "ratingAvg")]
    pub rating_avg: String,

    /// Rating count field on admin skill item.
    #[serde(rename = "ratingCount")]
    pub rating_count: String,

    /// Recommend weight field on admin skill item.
    #[serde(rename = "recommendWeight")]
    pub recommend_weight: i64,

    /// Repository url field on admin skill item.
    #[serde(rename = "repositoryUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub repository_url: Option<String>,

    /// Review comment field on admin skill item.
    #[serde(rename = "reviewComment")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_comment: Option<String>,

    /// Review status field on admin skill item.
    #[serde(rename = "reviewStatus")]
    pub review_status: String,

    /// Reviewed at field on admin skill item.
    #[serde(rename = "reviewedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reviewed_at: Option<String>,

    /// Reviewed by field on admin skill item.
    #[serde(rename = "reviewedBy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reviewed_by: Option<String>,

    /// Runtime field on admin skill item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Skill key field on admin skill item.
    #[serde(rename = "skillKey")]
    pub skill_key: String,

    /// Source type field on admin skill item.
    #[serde(rename = "sourceType")]
    pub source_type: String,

    /// Summary field on admin skill item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tags field on admin skill item.
    pub tags: Vec<String>,

    /// Updated at field on admin skill item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// Version field on admin skill item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Version name field on admin skill item.
    #[serde(rename = "versionName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_name: Option<String>,

    /// Visibility field on admin skill item.
    pub visibility: String,
}
