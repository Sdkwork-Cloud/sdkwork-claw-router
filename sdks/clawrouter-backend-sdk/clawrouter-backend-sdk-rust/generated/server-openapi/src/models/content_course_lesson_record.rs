use serde::{Deserialize, Serialize};

/// Content course lesson record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ContentCourseLessonRecord {
    /// Content field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,

    /// Course id field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub course_id: Option<String>,

    /// Created at field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Duration seconds field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<String>,

    /// Duration text field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_text: Option<String>,

    /// External bvid field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_bvid: Option<String>,

    /// Free preview field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub free_preview: Option<bool>,

    /// Id field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Lesson no field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub lesson_no: Option<i64>,

    /// Metadata field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Section id field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub section_id: Option<String>,

    /// Sort order field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Source provider field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_provider: Option<String>,

    /// Status field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Video url field on content course lesson record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub video_url: Option<String>,
}
