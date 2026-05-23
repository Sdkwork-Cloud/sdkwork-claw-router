use serde::{Deserialize, Serialize};

/// Admin recharge package mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminRechargePackageMutationResponse {
    /// Item field on admin recharge package mutation response.
    pub item: serde_json::Value,
}
