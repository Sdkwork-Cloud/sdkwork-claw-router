use serde::{Deserialize, Serialize};

/// Commerce standard resource response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceStandardResourceResponse {
    /// Item field on commerce standard resource response.
    pub item: serde_json::Value,
}
