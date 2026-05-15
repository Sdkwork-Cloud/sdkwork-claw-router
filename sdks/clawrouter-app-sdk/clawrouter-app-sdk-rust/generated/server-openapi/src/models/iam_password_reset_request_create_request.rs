use serde::{Deserialize, Serialize};

/// Iam password reset request create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamPasswordResetRequestCreateRequest {
    /// Account field on iam password reset request create request.
    pub account: String,

    /// Channel field on iam password reset request create request.
    pub channel: String,
}
