use serde::{Deserialize, Serialize};

/// Commerce payment provider account status update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentProviderAccountStatusUpdateRequest {
    /// Client request no field on commerce payment provider account status update request.
    #[serde(rename = "clientRequestNo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_request_no: Option<String>,

    /// Note field on commerce payment provider account status update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub note: Option<String>,

    /// Status field on commerce payment provider account status update request.
    pub status: String,
}
