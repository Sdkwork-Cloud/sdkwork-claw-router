use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformQrAuthScanResponse};

/// Qr auth sessions scans create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct QrAuthSessionsScansCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on qr auth sessions scans create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<OpenPlatformQrAuthScanResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
