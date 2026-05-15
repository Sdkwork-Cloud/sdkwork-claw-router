use serde::{Deserialize, Serialize};

/// Content course relation record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ContentCourseRelationRecord {
    /// Course id field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub course_id: Option<String>,

    /// Created at field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Related course id field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub related_course_id: Option<String>,

    /// Relation type field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub relation_type: Option<String>,

    /// Sort order field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on content course relation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
