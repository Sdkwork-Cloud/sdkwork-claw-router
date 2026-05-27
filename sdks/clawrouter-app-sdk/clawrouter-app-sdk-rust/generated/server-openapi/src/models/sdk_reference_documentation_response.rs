use serde::{Deserialize, Serialize};

/// Sdk reference documentation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SdkReferenceDocumentationResponse {
    /// Generated field on sdk reference documentation response.
    pub generated: bool,

    /// Language field on sdk reference documentation response.
    pub language: String,

    /// Method definition field on sdk reference documentation response.
    #[serde(rename = "methodDefinition")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub method_definition: Option<String>,

    /// Readme field on sdk reference documentation response.
    pub readme: String,

    /// Usage example field on sdk reference documentation response.
    #[serde(rename = "usageExample")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_example: Option<String>,
}
