use serde::{Deserialize, Serialize};

/// Integration provider record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationProviderRecord {
    /// Auth type field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_type: Option<String>,

    /// Base url template field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url_template: Option<String>,

    /// Capabilities field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<std::collections::HashMap<String, String>>,

    /// Color token field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub color_token: Option<String>,

    /// Created at field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default vendor code field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_vendor_code: Option<String>,

    /// Deleted at field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Display name field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,

    /// Docs url field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub docs_url: Option<String>,

    /// Icon url field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon_url: Option<String>,

    /// Id field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Integration type field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub integration_type: Option<String>,

    /// Metadata field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Metadata schema version field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata_schema_version: Option<String>,

    /// Organization id field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Protocol field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub protocol: Option<String>,

    /// Provider code field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Sort order field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Upstream provider code field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upstream_provider_code: Option<String>,

    /// Upstream vendor code field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upstream_vendor_code: Option<String>,

    /// Uuid field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Website url field on integration provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub website_url: Option<String>,
}
