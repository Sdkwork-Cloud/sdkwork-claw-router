use serde::{Deserialize, Serialize};

/// Plus agent skill package record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusAgentSkillPackageRecord {
    /// Category id field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Cover image field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover_image: Option<String>,

    /// Description field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Icon field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,

    /// Latest published at field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latest_published_at: Option<String>,

    /// Summary field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// User id field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
