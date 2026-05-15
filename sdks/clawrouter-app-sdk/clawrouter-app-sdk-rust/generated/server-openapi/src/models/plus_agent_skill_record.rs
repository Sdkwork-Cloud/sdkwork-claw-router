use serde::{Deserialize, Serialize};

/// Plus agent skill record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusAgentSkillRecord {
    /// Category id field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Cover image field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover_image: Option<String>,

    /// Description field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Documentation url field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub documentation_url: Option<String>,

    /// Entrypoint field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub entrypoint: Option<String>,

    /// Homepage url field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub homepage_url: Option<String>,

    /// Icon field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,

    /// Latest published at field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latest_published_at: Option<String>,

    /// License name field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license_name: Option<String>,

    /// Manifest url field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub manifest_url: Option<String>,

    /// Package id field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_id: Option<String>,

    /// Price field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price: Option<String>,

    /// Provider field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,

    /// Repository url field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub repository_url: Option<String>,

    /// Review comment field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_comment: Option<String>,

    /// Reviewed at field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reviewed_at: Option<String>,

    /// Reviewed by field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reviewed_by: Option<String>,

    /// Runtime field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Summary field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// User id field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Version field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Version name field on plus agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_name: Option<String>,
}
