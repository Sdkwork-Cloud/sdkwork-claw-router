use serde::{Deserialize, Serialize};

/// Iam verification code verify request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamVerificationCodeVerifyRequest {
    /// Code field on iam verification code verify request.
    pub code: String,

    /// Code id field on iam verification code verify request.
    #[serde(rename = "codeId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code_id: Option<String>,

    /// Scene field on iam verification code verify request.
    pub scene: String,

    /// Target field on iam verification code verify request.
    pub target: String,

    /// Verify type field on iam verification code verify request.
    #[serde(rename = "verifyType")]
    pub verify_type: String,
}
