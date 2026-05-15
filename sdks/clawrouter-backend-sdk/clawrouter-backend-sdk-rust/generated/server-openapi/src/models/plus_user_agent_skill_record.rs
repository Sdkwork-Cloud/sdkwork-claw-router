use serde::{Deserialize, Serialize};

/// Plus user agent skill record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusUserAgentSkillRecord {
    /// Installed at field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub installed_at: Option<String>,

    /// Last enabled at field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_enabled_at: Option<String>,

    /// Last used at field on plus user agent skill record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_used_at: Option<String>,
}
