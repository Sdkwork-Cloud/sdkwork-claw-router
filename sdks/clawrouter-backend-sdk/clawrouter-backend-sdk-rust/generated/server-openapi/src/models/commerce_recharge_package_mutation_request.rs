use serde::{Deserialize, Serialize};

/// Commerce recharge package mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRechargePackageMutationRequest {
    /// Bonus field on commerce recharge package mutation request.
    pub bonus: i64,

    /// Recharge package price as a canonical decimal money string.
    pub rmb: String,

    /// Status field on commerce recharge package mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
}
