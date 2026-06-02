use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Promotion operation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionOperationResponse {
    /// Payment id field on promotion operation response.
    #[serde(rename = "paymentId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payment_id: Option<String>,

    /// Qr code field on promotion operation response.
    #[serde(rename = "qrCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub qr_code: Option<MediaResource>,

    /// Qr code payload field on promotion operation response.
    #[serde(rename = "qrCodePayload")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub qr_code_payload: Option<String>,

    /// Request no field on promotion operation response.
    #[serde(rename = "requestNo")]
    pub request_no: String,

    /// Status field on promotion operation response.
    pub status: String,

    /// Success field on promotion operation response.
    pub success: bool,
}
