use serde::{Deserialize, Serialize};

/// Commerce category seed initialize summary schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCategorySeedInitializeSummary {
    /// Config key field on commerce category seed initialize summary.
    #[serde(rename = "configKey")]
    pub config_key: String,

    /// Dataset field on commerce category seed initialize summary.
    pub dataset: String,

    /// Install default enabled field on commerce category seed initialize summary.
    #[serde(rename = "installDefaultEnabled")]
    pub install_default_enabled: bool,

    /// Requested field on commerce category seed initialize summary.
    pub requested: i64,

    /// Skipped field on commerce category seed initialize summary.
    pub skipped: i64,

    /// Target table field on commerce category seed initialize summary.
    #[serde(rename = "targetTable")]
    pub target_table: String,

    /// Upserted field on commerce category seed initialize summary.
    pub upserted: i64,
}
