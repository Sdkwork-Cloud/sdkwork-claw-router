use serde::{Deserialize, Serialize};

/// Studio catalog artifact record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StudioCatalogArtifactRecord {
    /// Artifact ref field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_ref: Option<String>,

    /// Artifact size bytes field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_size_bytes: Option<String>,

    /// Artifact type field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_type: Option<String>,

    /// Artifact url field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_url: Option<String>,

    /// Checksum hash field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub checksum_hash: Option<String>,

    /// Created at field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Deprecated at field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deprecated_at: Option<String>,

    /// Frameworks field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub frameworks: Option<std::collections::HashMap<String, String>>,

    /// Id field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// License name field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license_name: Option<String>,

    /// Metadata field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Os name field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub os_name: Option<String>,

    /// Platform type field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub platform_type: Option<String>,

    /// Published at field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Release notes field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub release_notes: Option<String>,

    /// Runtime field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Status field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target id field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_id: Option<String>,

    /// Target type field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_type: Option<String>,

    /// Tenant id field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on studio catalog artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
