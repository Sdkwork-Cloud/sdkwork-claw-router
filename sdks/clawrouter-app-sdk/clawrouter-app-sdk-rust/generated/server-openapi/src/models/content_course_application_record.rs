use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Content course application record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ContentCourseApplicationRecord {
    /// Category field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,

    /// Contact email field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contact_email: Option<String>,

    /// Contact name field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contact_name: Option<String>,

    /// Created at field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// External bvid field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_bvid: Option<String>,

    /// Id field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Review comment field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_comment: Option<String>,

    /// Reviewed at field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reviewed_at: Option<String>,

    /// Reviewed by field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reviewed_by: Option<String>,

    /// Source provider field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_provider: Option<String>,

    /// Status field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Submitted at field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub submitted_at: Option<String>,

    /// Tenant id field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Video field on content course application record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub video: Option<MediaResource>,
}
