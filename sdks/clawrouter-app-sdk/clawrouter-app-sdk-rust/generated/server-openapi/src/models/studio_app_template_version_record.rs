use serde::{Deserialize, Serialize};

/// Studio app template version record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StudioAppTemplateVersionRecord {
    /// App config schema field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_config_schema: Option<std::collections::HashMap<String, String>>,

    /// Artifact id field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_id: Option<String>,

    /// Capability manifest field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability_manifest: Option<std::collections::HashMap<String, String>>,

    /// Changelog field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub changelog: Option<String>,

    /// Created at field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default app config field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_app_config: Option<std::collections::HashMap<String, String>>,

    /// Deleted at field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Dependency manifest field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub dependency_manifest: Option<std::collections::HashMap<String, String>>,

    /// Deprecated at field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deprecated_at: Option<String>,

    /// File manifest field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_manifest: Option<std::collections::HashMap<String, String>>,

    /// Id field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Publish status field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub publish_status: Option<String>,

    /// Published at field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Status field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Template id field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_id: Option<String>,

    /// Tenant id field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Variable schema field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub variable_schema: Option<std::collections::HashMap<String, String>>,

    /// Version field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Version no field on studio app template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_no: Option<String>,
}
