use serde::{Deserialize, Serialize};

/// Sdk reference archive response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SdkReferenceArchiveResponse {
    /// Content base 64 field on sdk reference archive response.
    #[serde(rename = "contentBase64")]
    pub content_base64: String,

    /// Content type field on sdk reference archive response.
    #[serde(rename = "contentType")]
    pub content_type: String,

    /// File name field on sdk reference archive response.
    #[serde(rename = "fileName")]
    pub file_name: String,

    /// Language field on sdk reference archive response.
    pub language: String,
}
