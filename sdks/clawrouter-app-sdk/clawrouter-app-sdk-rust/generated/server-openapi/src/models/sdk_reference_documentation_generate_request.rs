use serde::{Deserialize, Serialize};

/// Sdk reference documentation generate request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SdkReferenceDocumentationGenerateRequest {
    /// Config field on sdk reference documentation generate request.
    pub config: serde_json::Value,

    /// Language field on sdk reference documentation generate request.
    pub language: String,

    /// Spec field on sdk reference documentation generate request.
    pub spec: std::collections::HashMap<String, String>,
}
