use serde::{Deserialize, Serialize};

/// Redeem code request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RedeemCodeRequest {
    /// Code field on redeem code request.
    pub code: String,
}
