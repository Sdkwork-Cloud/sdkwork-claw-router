use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Plus agent skill record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusAgentSkillRecord {
    /// Builtin field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub builtin: Option<bool>,

    /// Capabilities field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<std::collections::HashMap<String, String>>,

    /// Category id field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Config schema field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config_schema: Option<std::collections::HashMap<String, String>>,

    /// Cover field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover: Option<MediaResource>,

    /// Created at field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Data scope field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<i64>,

    /// Default config field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_config: Option<std::collections::HashMap<String, String>>,

    /// Description field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Documentation url field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub documentation_url: Option<String>,

    /// Enabled field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,

    /// Entrypoint field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub entrypoint: Option<String>,

    /// Featured field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub featured: Option<bool>,

    /// Homepage url field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub homepage_url: Option<String>,

    /// Icon field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<MediaResource>,

    /// Id field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Install count field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub install_count: Option<String>,

    /// Is builtin field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub is_builtin: Option<bool>,

    /// Latest published at field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latest_published_at: Option<String>,

    /// License name field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license_name: Option<String>,

    /// Manifest url field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub manifest_url: Option<String>,

    /// Market status field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub market_status: Option<String>,

    /// Name field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Package id field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_id: Option<String>,

    /// Price field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price: Option<String>,

    /// Provider field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,

    /// Rating avg field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rating_avg: Option<String>,

    /// Rating count field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rating_count: Option<String>,

    /// Recommend weight field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recommend_weight: Option<i64>,

    /// Repository url field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub repository_url: Option<String>,

    /// Review comment field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_comment: Option<String>,

    /// Review status field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_status: Option<String>,

    /// Reviewed at field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reviewed_at: Option<String>,

    /// Reviewed by field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reviewed_by: Option<String>,

    /// Runtime field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Skill key field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub skill_key: Option<String>,

    /// Source type field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Summary field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tags field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<std::collections::HashMap<String, String>>,

    /// Tenant id field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// V field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub v: Option<String>,

    /// Version field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Version name field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_name: Option<String>,

    /// Visibility field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub visibility: Option<String>,
}
