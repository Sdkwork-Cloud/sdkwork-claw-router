use serde::{Deserialize, Serialize};

/// Course application video upload response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseApplicationVideoUploadResponse {
    /// Content type field on course application video upload response.
    #[serde(rename = "contentType")]
    pub content_type: String,

    /// File name field on course application video upload response.
    #[serde(rename = "fileName")]
    pub file_name: String,

    /// Sha 256 field on course application video upload response.
    pub sha256: String,

    /// Size bytes field on course application video upload response.
    #[serde(rename = "sizeBytes")]
    pub size_bytes: i64,

    /// Uploaded at field on course application video upload response.
    #[serde(rename = "uploadedAt")]
    pub uploaded_at: String,

    /// Video url field on course application video upload response.
    #[serde(rename = "videoUrl")]
    pub video_url: String,
}
