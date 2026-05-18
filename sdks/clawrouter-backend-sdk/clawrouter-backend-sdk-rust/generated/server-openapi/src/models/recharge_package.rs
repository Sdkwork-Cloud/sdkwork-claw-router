use serde::{Deserialize, Serialize};

/// Recharge package schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RechargePackage {
    /// Bonus field on recharge package.
    pub bonus: i64,

    /// Id field on recharge package.
    pub id: String,

    /// Total credited points for this recharge package, including bonus points.
    pub points: i64,

    /// Recharge package price as a canonical decimal money string.
    pub rmb: String,
}
