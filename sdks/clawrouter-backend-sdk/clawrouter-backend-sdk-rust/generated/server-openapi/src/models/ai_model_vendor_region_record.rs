use serde::{Deserialize, Serialize};

/// Ai model vendor region record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelVendorRegionRecord {
    /// Billing currency field on ai model vendor region record.
    pub billing_currency: String,

    /// Billing jurisdiction field on ai model vendor region record.
    pub billing_jurisdiction: String,

    /// Capabilities field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<std::collections::HashMap<String, String>>,

    /// Country region field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub country_region: Option<String>,

    /// Created at field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Display name field on ai model vendor region record.
    pub display_name: String,

    /// Docs url field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub docs_url: Option<String>,

    /// Id field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal name field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_name: Option<String>,

    /// Market scope field on ai model vendor region record.
    pub market_scope: String,

    /// Metadata field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Open source field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub open_source: Option<bool>,

    /// Operating regions field on ai model vendor region record.
    pub operating_regions: std::collections::HashMap<String, String>,

    /// Organization id field on ai model vendor region record.
    pub organization_id: String,

    /// Region code field on ai model vendor region record.
    pub region_code: String,

    /// Sort order field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai model vendor region record.
    pub status: String,

    /// Tenant id field on ai model vendor region record.
    pub tenant_id: String,

    /// Updated at field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai model vendor region record.
    pub uuid: String,

    /// Vendor code field on ai model vendor region record.
    pub vendor_code: String,

    /// Vendor id field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_id: Option<String>,

    /// Version field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Website url field on ai model vendor region record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub website_url: Option<String>,
}
