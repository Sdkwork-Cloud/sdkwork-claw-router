use serde::{Deserialize, Serialize};

/// Open platform pay binding create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformPayBindingCreateRequest {
    /// Mode field on open platform pay binding create request.
    pub mode: String,

    /// Payment account id field on open platform pay binding create request.
    #[serde(rename = "paymentAccountId")]
    pub payment_account_id: String,

    /// Payment channel id field on open platform pay binding create request.
    #[serde(rename = "paymentChannelId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payment_channel_id: Option<String>,

    /// Scene field on open platform pay binding create request.
    pub scene: String,
}
