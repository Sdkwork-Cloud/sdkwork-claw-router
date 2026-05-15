use serde::{Deserialize, Serialize};

/// System installation state record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SystemInstallationStateRecord {
    /// Catalog version field on system installation state record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub catalog_version: Option<String>,

    /// Database engine field on system installation state record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub database_engine: Option<String>,

    /// Environment field on system installation state record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub environment: Option<String>,

    /// Id field on system installation state record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Installation id field on system installation state record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub installation_id: Option<String>,

    /// Installed at field on system installation state record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub installed_at: Option<String>,

    /// Last checked at field on system installation state record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_checked_at: Option<String>,

    /// Metadata field on system installation state record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Schema version field on system installation state record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub schema_version: Option<String>,

    /// Seed profile field on system installation state record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seed_profile: Option<String>,

    /// Status field on system installation state record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Upgraded at field on system installation state record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upgraded_at: Option<String>,
}
