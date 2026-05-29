use serde::{Deserialize, Serialize};

/// Ai vendor api endpoint record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiVendorApiEndpointRecord {
    /// Api endpoint id field on ai vendor api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_endpoint_id: Option<String>,

    /// Created at field on ai vendor api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai vendor api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai vendor api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai vendor api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Endpoint code field on ai vendor api endpoint record.
    pub endpoint_code: String,

    /// Id field on ai vendor api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai vendor api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai vendor api endpoint record.
    pub organization_id: String,

    /// Sort order field on ai vendor api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai vendor api endpoint record.
    pub status: String,

    /// Supported field on ai vendor api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supported: Option<bool>,

    /// Tenant id field on ai vendor api endpoint record.
    pub tenant_id: String,

    /// Updated at field on ai vendor api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai vendor api endpoint record.
    pub uuid: String,

    /// Vendor code field on ai vendor api endpoint record.
    pub vendor_code: String,

    /// Vendor id field on ai vendor api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_id: Option<String>,

    /// Version field on ai vendor api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
