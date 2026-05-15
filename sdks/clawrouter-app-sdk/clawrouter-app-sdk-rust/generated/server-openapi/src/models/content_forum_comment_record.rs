use serde::{Deserialize, Serialize};

/// Content forum comment record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ContentForumCommentRecord {
    /// Author id field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub author_id: Option<String>,

    /// Author snapshot field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub author_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Body field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub body: Option<String>,

    /// Course id field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub course_id: Option<String>,

    /// Created at field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Like count field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub like_count: Option<String>,

    /// Metadata field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Parent id field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Post id field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub post_id: Option<String>,

    /// Root id field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub root_id: Option<String>,

    /// Status field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target id field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_id: Option<String>,

    /// Target type field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_type: Option<String>,

    /// Tenant id field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on content forum comment record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
