use serde::{Deserialize, Serialize};

/// Ai model vendor record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelVendorRecord {
    /// Capabilities field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<std::collections::HashMap<String, String>>,

    /// Color token field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub color_token: Option<String>,

    /// Country region field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub country_region: Option<String>,

    /// Created at field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Display name field on ai model vendor record.
    pub display_name: String,

    /// Docs url field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub docs_url: Option<String>,

    /// Icon url field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon_url: Option<String>,

    /// Id field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal name field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_name: Option<String>,

    /// Logo url field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub logo_url: Option<String>,

    /// Metadata field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model families field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_families: Option<std::collections::HashMap<String, String>>,

    /// Open source field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub open_source: Option<bool>,

    /// Organization id field on ai model vendor record.
    pub organization_id: String,

    /// Sort order field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai model vendor record.
    pub status: String,

    /// Tenant id field on ai model vendor record.
    pub tenant_id: String,

    /// Updated at field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai model vendor record.
    pub uuid: String,

    /// Vendor code field on ai model vendor record.
    pub vendor_code: String,

    /// Vendor type field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_type: Option<String>,

    /// Version field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Website url field on ai model vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub website_url: Option<String>,
}
