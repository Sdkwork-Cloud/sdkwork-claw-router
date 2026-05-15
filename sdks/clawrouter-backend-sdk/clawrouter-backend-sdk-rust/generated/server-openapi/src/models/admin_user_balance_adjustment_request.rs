use serde::{Deserialize, Serialize};

/// Admin user balance adjustment request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminUserBalanceAdjustmentRequest {
    /// Positive balance adjustment amount.
    pub amount: f64,

    /// Balance adjustment direction.
    pub r#type: String,
}
