use serde::{Deserialize, Serialize};

/// Ai channel vendor record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChannelVendorRecord {
    /// Channel code field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_code: Option<String>,

    /// Channel id field on ai channel vendor record.
    pub channel_id: String,

    /// Channel type field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_type: Option<String>,

    /// Created at field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai channel vendor record.
    pub organization_id: String,

    /// Provider code field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Sort order field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai channel vendor record.
    pub status: String,

    /// Supported field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supported: Option<bool>,

    /// Tenant id field on ai channel vendor record.
    pub tenant_id: String,

    /// Updated at field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai channel vendor record.
    pub uuid: String,

    /// Vendor code field on ai channel vendor record.
    pub vendor_code: String,

    /// Vendor id field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_id: Option<String>,

    /// Version field on ai channel vendor record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
