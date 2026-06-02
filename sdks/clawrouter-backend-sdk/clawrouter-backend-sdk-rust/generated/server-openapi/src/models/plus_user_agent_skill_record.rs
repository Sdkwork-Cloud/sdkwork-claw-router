use serde::{Deserialize, Serialize};

/// Plus user agent skill record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusUserAgentSkillRecord {
    /// Config field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config: Option<std::collections::HashMap<String, String>>,

    /// Created at field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<i64>,

    /// Enabled field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,

    /// Id field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Installed at field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub installed_at: Option<String>,

    /// Last enabled at field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_enabled_at: Option<String>,

    /// Last used at field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_used_at: Option<String>,

    /// Organization id field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Skill id field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub skill_id: Option<String>,

    /// Tenant id field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Used count field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub used_count: Option<String>,

    /// User id field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// V field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub v: Option<String>,
}
