use serde::{Deserialize, Serialize};

/// Iam oauth session create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamOauthSessionCreateRequest {
    /// Code field on iam oauth session create request.
    pub code: String,

    /// Device id field on iam oauth session create request.
    #[serde(rename = "deviceId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_id: Option<String>,

    /// Device type field on iam oauth session create request.
    #[serde(rename = "deviceType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_type: Option<String>,

    /// Provider field on iam oauth session create request.
    pub provider: String,

    /// State field on iam oauth session create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub state: Option<String>,
}
