use serde::{Deserialize, Serialize};

/// Studio app template usage record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StudioAppTemplateUsageRecord {
    /// Created at field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Input snapshot field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Metadata field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Output snapshot field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Request id field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Status field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target app id field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_app_id: Option<String>,

    /// Template id field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_id: Option<String>,

    /// Template version id field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_version_id: Option<String>,

    /// Tenant id field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Usage type field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_type: Option<String>,

    /// User id field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on studio app template usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
