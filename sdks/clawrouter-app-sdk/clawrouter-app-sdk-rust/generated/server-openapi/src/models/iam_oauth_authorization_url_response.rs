use serde::{Deserialize, Serialize};

/// Iam oauth authorization url response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamOauthAuthorizationUrlResponse {
    /// Auth url field on iam oauth authorization url response.
    #[serde(rename = "authUrl")]
    pub auth_url: String,
}
