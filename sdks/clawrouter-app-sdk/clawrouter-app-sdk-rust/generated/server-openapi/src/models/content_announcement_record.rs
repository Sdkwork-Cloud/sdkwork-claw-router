use serde::{Deserialize, Serialize};

/// Content announcement record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ContentAnnouncementRecord {
    /// Announcement type field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub announcement_type: Option<String>,

    /// Audience filter field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub audience_filter: Option<std::collections::HashMap<String, String>>,

    /// Content field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,

    /// Created at field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Pinned field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pinned: Option<bool>,

    /// Published at field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Status field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target scope field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_scope: Option<String>,

    /// Tenant id field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on content announcement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
