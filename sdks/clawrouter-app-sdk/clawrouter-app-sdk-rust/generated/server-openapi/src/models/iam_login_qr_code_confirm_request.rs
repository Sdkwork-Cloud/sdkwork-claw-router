use serde::{Deserialize, Serialize};

/// Iam login qr code confirm request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamLoginQrCodeConfirmRequest {
    /// Qr key field on iam login qr code confirm request.
    #[serde(rename = "qrKey")]
    pub qr_key: String,
}
