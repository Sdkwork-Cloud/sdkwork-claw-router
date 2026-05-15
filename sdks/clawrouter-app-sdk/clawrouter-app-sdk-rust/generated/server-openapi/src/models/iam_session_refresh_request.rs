use serde::{Deserialize, Serialize};

/// Iam session refresh request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamSessionRefreshRequest {
    /// Refresh token field on iam session refresh request.
    #[serde(rename = "refreshToken")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub refresh_token: Option<String>,
}
