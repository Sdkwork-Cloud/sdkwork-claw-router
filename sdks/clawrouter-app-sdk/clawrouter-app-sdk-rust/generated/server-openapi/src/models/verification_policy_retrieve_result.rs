use serde::{Deserialize, Serialize};

use crate::models::{AuthVerificationPolicy};

/// Verification policy retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct VerificationPolicyRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on verification policy retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AuthVerificationPolicy>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
