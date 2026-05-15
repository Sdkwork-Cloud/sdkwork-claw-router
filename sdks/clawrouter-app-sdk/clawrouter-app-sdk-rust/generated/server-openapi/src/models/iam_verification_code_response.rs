use serde::{Deserialize, Serialize};

/// Iam verification code response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamVerificationCodeResponse {
    /// Code id field on iam verification code response.
    #[serde(rename = "codeId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code_id: Option<String>,

    /// Local/private deployment development code returned only when no notification adapter is configured.
    #[serde(rename = "debugCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub debug_code: Option<String>,

    /// Expires at field on iam verification code response.
    #[serde(rename = "expiresAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,
}
