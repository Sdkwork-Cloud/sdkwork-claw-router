use serde::{Deserialize, Serialize};

/// Sdk reference archive generate request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SdkReferenceArchiveGenerateRequest {
    /// Config field on sdk reference archive generate request.
    pub config: serde_json::Value,

    /// Language field on sdk reference archive generate request.
    pub language: String,

    /// Spec field on sdk reference archive generate request.
    pub spec: std::collections::HashMap<String, String>,
}
