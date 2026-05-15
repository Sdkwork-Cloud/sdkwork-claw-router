use serde::{Deserialize, Serialize};

/// Course application create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseApplicationCreateRequest {
    /// Category field on course application create request.
    pub category: String,

    /// Contact email field on course application create request.
    #[serde(rename = "contactEmail")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contact_email: Option<String>,

    /// Contact name field on course application create request.
    #[serde(rename = "contactName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contact_name: Option<String>,

    /// Description field on course application create request.
    pub description: String,

    /// External bvid field on course application create request.
    #[serde(rename = "externalBvid")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_bvid: Option<String>,

    /// Notes field on course application create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub notes: Option<String>,

    /// Source provider field on course application create request.
    #[serde(rename = "sourceProvider")]
    pub source_provider: String,

    /// Title field on course application create request.
    pub title: String,

    /// Video url field on course application create request.
    #[serde(rename = "videoUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub video_url: Option<String>,
}
