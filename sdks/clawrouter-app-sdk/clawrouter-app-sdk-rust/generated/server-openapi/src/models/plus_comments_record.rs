use serde::{Deserialize, Serialize};

/// Plus comments record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusCommentsRecord {
    /// Author field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub author: Option<std::collections::HashMap<String, String>>,

    /// Content field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,

    /// Content id field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_id: Option<String>,

    /// Content type field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_type: Option<i64>,

    /// Created at field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<i64>,

    /// Device info field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_info: Option<String>,

    /// Id field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Ip address field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ip_address: Option<String>,

    /// Is top field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub is_top: Option<bool>,

    /// Likes field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub likes: Option<i64>,

    /// Organization id field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Parent id field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Path field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// Reply count field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reply_count: Option<i64>,

    /// Sort weight field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_weight: Option<i64>,

    /// Status field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<i64>,

    /// Tenant id field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// V field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub v: Option<String>,
}
