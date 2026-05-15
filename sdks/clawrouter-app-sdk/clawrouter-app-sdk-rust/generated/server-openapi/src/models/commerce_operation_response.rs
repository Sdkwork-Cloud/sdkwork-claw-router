use serde::{Deserialize, Serialize};

/// Commerce operation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceOperationResponse {
    /// Request no field on commerce operation response.
    #[serde(rename = "requestNo")]
    pub request_no: String,

    /// Status field on commerce operation response.
    pub status: String,

    /// Success field on commerce operation response.
    pub success: bool,
}
