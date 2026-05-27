use serde::{Deserialize, Serialize};

use crate::models::{AuthVerificationPolicy};

/// Iam verification policy retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamVerificationPolicyRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on iam verification policy retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AuthVerificationPolicy>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
