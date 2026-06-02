use serde::{Deserialize, Serialize};

/// Plus content vote record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusContentVoteRecord {
    /// Client ip field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip: Option<String>,

    /// Content id field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_id: Option<String>,

    /// Content type field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_type: Option<i64>,

    /// Created at field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<i64>,

    /// Device info field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_info: Option<String>,

    /// Id field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Rating field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rating: Option<String>,

    /// Source field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,

    /// Tenant id field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// V field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub v: Option<String>,
}
