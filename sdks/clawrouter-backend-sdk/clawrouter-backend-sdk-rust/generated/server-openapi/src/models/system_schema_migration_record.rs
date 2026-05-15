use serde::{Deserialize, Serialize};

/// System schema migration record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SystemSchemaMigrationRecord {
    /// Checksum field on system schema migration record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub checksum: Option<String>,

    /// Error message field on system schema migration record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_message: Option<String>,

    /// Finished at field on system schema migration record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub finished_at: Option<String>,

    /// Id field on system schema migration record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Migration key field on system schema migration record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub migration_key: Option<String>,

    /// Migration version field on system schema migration record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub migration_version: Option<String>,

    /// Started at field on system schema migration record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on system schema migration record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
}
