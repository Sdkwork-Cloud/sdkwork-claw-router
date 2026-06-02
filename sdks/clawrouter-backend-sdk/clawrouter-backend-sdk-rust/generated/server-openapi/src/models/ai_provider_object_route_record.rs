use serde::{Deserialize, Serialize};

/// Ai provider object route record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiProviderObjectRouteRecord {
    /// Api code field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_code: Option<String>,

    /// Api key id field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_key_id: Option<String>,

    /// Catalog key field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub catalog_key: Option<String>,

    /// Channel group id field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_group_id: Option<String>,

    /// Channel id field on ai provider object route record.
    pub channel_id: String,

    /// Created at field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Endpoint id field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub endpoint_id: Option<String>,

    /// Expires at field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Id field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last seen at field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_seen_at: Option<String>,

    /// Metadata field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Object id field on ai provider object route record.
    pub object_id: String,

    /// Object key hash field on ai provider object route record.
    pub object_key_hash: String,

    /// Object type field on ai provider object route record.
    pub object_type: String,

    /// Organization id field on ai provider object route record.
    pub organization_id: String,

    /// Parent object id field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_object_id: Option<String>,

    /// Parent object type field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_object_type: Option<String>,

    /// Provider code field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Provider model field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_model: Option<String>,

    /// Region code field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region_code: Option<String>,

    /// Status field on ai provider object route record.
    pub status: String,

    /// Sticky scope field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sticky_scope: Option<String>,

    /// Tenant id field on ai provider object route record.
    pub tenant_id: String,

    /// Updated at field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai provider object route record.
    pub uuid: String,

    /// Vendor code field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,

    /// Version field on ai provider object route record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
