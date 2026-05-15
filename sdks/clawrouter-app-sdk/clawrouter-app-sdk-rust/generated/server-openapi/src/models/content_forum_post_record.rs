use serde::{Deserialize, Serialize};

/// Content forum post record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ContentForumPostRecord {
    /// Author id field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub author_id: Option<String>,

    /// Author snapshot field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub author_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Body field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub body: Option<String>,

    /// Category field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,

    /// Comment count field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub comment_count: Option<String>,

    /// Content snippet field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_snippet: Option<String>,

    /// Created at field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last replied at field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_replied_at: Option<String>,

    /// Like count field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub like_count: Option<String>,

    /// Metadata field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Pinned field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pinned: Option<bool>,

    /// Status field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tags field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<std::collections::HashMap<String, String>>,

    /// Tenant id field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// View count field on content forum post record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub view_count: Option<String>,
}
