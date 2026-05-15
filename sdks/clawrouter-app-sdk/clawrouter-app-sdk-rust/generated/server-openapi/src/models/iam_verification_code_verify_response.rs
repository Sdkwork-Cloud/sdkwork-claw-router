use serde::{Deserialize, Serialize};

/// Iam verification code verify response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamVerificationCodeVerifyResponse {
    /// Valid field on iam verification code verify response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub valid: Option<bool>,

    /// Verified field on iam verification code verify response.
    pub verified: bool,
}
