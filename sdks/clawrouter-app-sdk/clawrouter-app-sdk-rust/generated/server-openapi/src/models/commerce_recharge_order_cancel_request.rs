use serde::{Deserialize, Serialize};

/// Commerce recharge order cancel request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRechargeOrderCancelRequest {
    /// Reason field on commerce recharge order cancel request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,
}
