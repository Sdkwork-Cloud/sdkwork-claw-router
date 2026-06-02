use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Course application create response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseApplicationCreateResponse {
    /// Application id field on course application create response.
    #[serde(rename = "applicationId")]
    pub application_id: i64,

    /// Category field on course application create response.
    pub category: String,

    /// Contact email field on course application create response.
    #[serde(rename = "contactEmail")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contact_email: Option<String>,

    /// Contact name field on course application create response.
    #[serde(rename = "contactName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contact_name: Option<String>,

    /// Description field on course application create response.
    pub description: String,

    /// External bvid field on course application create response.
    #[serde(rename = "externalBvid")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_bvid: Option<String>,

    /// Id field on course application create response.
    pub id: String,

    /// Source provider field on course application create response.
    #[serde(rename = "sourceProvider")]
    pub source_provider: String,

    /// Status field on course application create response.
    pub status: String,

    /// Submitted at field on course application create response.
    #[serde(rename = "submittedAt")]
    pub submitted_at: String,

    /// Title field on course application create response.
    pub title: String,

    /// Video field on course application create response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub video: Option<MediaResource>,
}
