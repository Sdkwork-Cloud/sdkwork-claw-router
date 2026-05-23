use serde::{Deserialize, Serialize};

use crate::models::{IamLoginQrCodeStatusResponse};

/// Login qr codes confirm result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct LoginQrCodesConfirmResult {
    /// Business response code.
    pub code: String,

    /// Data field on login qr codes confirm result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<IamLoginQrCodeStatusResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
