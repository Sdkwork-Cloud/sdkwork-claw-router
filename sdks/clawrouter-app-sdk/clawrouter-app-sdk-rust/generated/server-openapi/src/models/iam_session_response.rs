use serde::{Deserialize, Serialize};

use crate::models::{IamAppContext, IamUserResponse};

/// Iam session response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamSessionResponse {
    /// Data isolation and tenant access token. Clients send it as Sdkwork-Access-Token.
    #[serde(rename = "accessToken")]
    pub access_token: String,

    /// Bearer authentication token. Clients send it as Authorization Bearer.
    #[serde(rename = "authToken")]
    pub auth_token: String,

    /// Context field on iam session response.
    pub context: IamAppContext,

    /// Expires at field on iam session response.
    #[serde(rename = "expiresAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Refresh token for session renewal.
    #[serde(rename = "refreshToken")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub refresh_token: Option<String>,

    /// Session id field on iam session response.
    #[serde(rename = "sessionId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub session_id: Option<String>,

    /// User field on iam session response.
    pub user: IamUserResponse,
}
