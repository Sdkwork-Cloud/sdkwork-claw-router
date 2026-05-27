use serde::{Deserialize, Serialize};

/// Promotion command request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionCommandRequest {
    /// Client request no field on promotion command request.
    #[serde(rename = "clientRequestNo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_request_no: Option<String>,

    /// Metadata field on promotion command request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Note field on promotion command request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub note: Option<String>,
}
