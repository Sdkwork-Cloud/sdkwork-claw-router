use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentChannelListResponse};

/// Payments channels list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsChannelsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments channels list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentChannelListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
