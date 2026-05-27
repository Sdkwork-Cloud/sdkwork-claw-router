use serde::{Deserialize, Serialize};

/// Iam verification code response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamVerificationCodeResponse {
    /// Code id field on iam verification code response.
    #[serde(rename = "codeId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code_id: Option<String>,

    /// Messaging send request id that carries the external SMS or email delivery audit trail.
    #[serde(rename = "deliveryRequestId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivery_request_id: Option<String>,

    /// Expires at field on iam verification code response.
    #[serde(rename = "expiresAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,
}
