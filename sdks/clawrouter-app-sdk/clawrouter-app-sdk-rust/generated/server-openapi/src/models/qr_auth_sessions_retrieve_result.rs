use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformQrAuthSessionResponse};

/// Qr auth sessions retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct QrAuthSessionsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on qr auth sessions retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<OpenPlatformQrAuthSessionResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
