use serde::{Deserialize, Serialize};

/// Plus favorite record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusFavoriteRecord {
    /// Content id field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_id: Option<String>,

    /// Content type field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_type: Option<i64>,

    /// Created at field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<i64>,

    /// Folder id field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub folder_id: Option<String>,

    /// Id field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Image field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub image: Option<std::collections::HashMap<String, String>>,

    /// Is private field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub is_private: Option<bool>,

    /// Last viewed at field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_viewed_at: Option<String>,

    /// Organization id field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Remark field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub remark: Option<String>,

    /// Sort weight field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_weight: Option<i64>,

    /// Status field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<i64>,

    /// Tags field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<String>,

    /// Tenant id field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// V field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub v: Option<String>,

    /// View count field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub view_count: Option<i64>,
}
