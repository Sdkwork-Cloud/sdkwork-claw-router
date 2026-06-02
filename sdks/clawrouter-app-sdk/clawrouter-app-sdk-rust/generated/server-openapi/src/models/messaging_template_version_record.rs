use serde::{Deserialize, Serialize};

/// Messaging template version record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagingTemplateVersionRecord {
    /// Content hash field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_hash: Option<String>,

    /// Created at field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Html template field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub html_template: Option<String>,

    /// Id field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Published at field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Render engine field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub render_engine: Option<String>,

    /// Retired at field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retired_at: Option<String>,

    /// Review status field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_status: Option<String>,

    /// Status field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Subject template field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_template: Option<String>,

    /// Template id field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_id: Option<String>,

    /// Tenant id field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Text template field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub text_template: Option<String>,

    /// Updated at field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Variable schema field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub variable_schema: Option<std::collections::HashMap<String, String>>,

    /// Version field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Version no field on messaging template version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_no: Option<i64>,
}
