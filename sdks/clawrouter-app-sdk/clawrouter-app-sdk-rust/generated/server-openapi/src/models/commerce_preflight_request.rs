use serde::{Deserialize, Serialize};

/// Commerce preflight request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePreflightRequest {
    /// Amount field on commerce preflight request.
    pub amount: String,

    /// Business type field on commerce preflight request.
    #[serde(rename = "businessType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub business_type: Option<String>,

    /// Remarks field on commerce preflight request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub remarks: Option<String>,

    /// Request no field on commerce preflight request.
    #[serde(rename = "requestNo")]
    pub request_no: String,
}
