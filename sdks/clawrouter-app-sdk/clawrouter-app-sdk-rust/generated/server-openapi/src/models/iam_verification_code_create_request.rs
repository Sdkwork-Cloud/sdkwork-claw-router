use serde::{Deserialize, Serialize};

/// Iam verification code create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamVerificationCodeCreateRequest {
    /// Scene field on iam verification code create request.
    pub scene: String,

    /// Target field on iam verification code create request.
    pub target: String,

    /// Verify type field on iam verification code create request.
    #[serde(rename = "verifyType")]
    pub verify_type: String,
}
