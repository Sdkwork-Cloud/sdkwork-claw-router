use serde::{Deserialize, Serialize};

use crate::models::{IamSessionResponse, IamUserResponse};

/// Iam login qr code status response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamLoginQrCodeStatusResponse {
    /// Session field on iam login qr code status response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub session: Option<IamSessionResponse>,

    /// Status field on iam login qr code status response.
    pub status: String,

    /// Token field on iam login qr code status response.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token: Option<IamSessionResponse>,

    /// User info field on iam login qr code status response.
    #[serde(rename = "userInfo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_info: Option<IamUserResponse>,
}
