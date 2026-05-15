use serde::{Deserialize, Serialize};

/// Submit recharge request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SubmitRechargeRequest {
    /// Recharge amount as a canonical decimal money string.
    pub amount: String,

    /// Payment method code.
    pub method: String,
}
