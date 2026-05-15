use serde::{Deserialize, Serialize};

/// Iam password reset request response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamPasswordResetRequestResponse {
    /// Local/private deployment development code returned only when no notification adapter is configured.
    #[serde(rename = "debugCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub debug_code: Option<String>,

    /// Expires at field on iam password reset request response.
    #[serde(rename = "expiresAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Request id field on iam password reset request response.
    #[serde(rename = "requestId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,
}
