use serde::{Deserialize, Serialize};

use crate::models::{SkillCatalogItem};

/// App installed skill item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppInstalledSkillItem {
    /// User-scoped runtime configuration for the installed agent skill.
    pub config: std::collections::HashMap<String, String>,

    /// Enabled field on app installed skill item.
    pub enabled: bool,

    /// Id field on app installed skill item.
    pub id: String,

    /// Installed at field on app installed skill item.
    #[serde(rename = "installedAt")]
    pub installed_at: String,

    /// Last enabled at field on app installed skill item.
    #[serde(rename = "lastEnabledAt")]
    pub last_enabled_at: String,

    /// Skill field on app installed skill item.
    pub skill: SkillCatalogItem,

    /// Skill id field on app installed skill item.
    #[serde(rename = "skillId")]
    pub skill_id: String,
}
