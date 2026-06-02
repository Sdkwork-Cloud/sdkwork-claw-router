use serde::{Deserialize, Serialize};

/// Messaging template variant record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagingTemplateVariantRecord {
    /// Body template field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub body_template: Option<String>,

    /// Channel field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel: Option<String>,

    /// Content format field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_format: Option<String>,

    /// Created at field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Length limit field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub length_limit: Option<i64>,

    /// Locale field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub locale: Option<String>,

    /// Metadata field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider payload schema field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_payload_schema: Option<std::collections::HashMap<String, String>>,

    /// Render options field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub render_options: Option<std::collections::HashMap<String, String>>,

    /// Status field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Template version id field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_version_id: Option<String>,

    /// Tenant id field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on messaging template variant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
