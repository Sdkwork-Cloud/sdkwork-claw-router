use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Content course record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ContentCourseRecord {
    /// Category field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,

    /// Content field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,

    /// Course code field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub course_code: Option<String>,

    /// Created at field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Data scope field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Duration text field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_text: Option<String>,

    /// External bvid field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_bvid: Option<String>,

    /// Id field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Instructor snapshot field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub instructor_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Is collection field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub is_collection: Option<bool>,

    /// Lessons count field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub lessons_count: Option<i64>,

    /// Level field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub level: Option<String>,

    /// Metadata field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Price amount field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_amount: Option<String>,

    /// Published at field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Rating score field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rating_score: Option<String>,

    /// Status field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Students count field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub students_count: Option<String>,

    /// Tags field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<std::collections::HashMap<String, String>>,

    /// Tenant id field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Thumbnail field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<MediaResource>,

    /// Title field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on content course record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
