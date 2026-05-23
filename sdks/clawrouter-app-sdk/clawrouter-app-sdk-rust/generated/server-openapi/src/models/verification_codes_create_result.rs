use serde::{Deserialize, Serialize};

use crate::models::{IamVerificationCodeResponse};

/// Verification codes create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct VerificationCodesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on verification codes create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<IamVerificationCodeResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
