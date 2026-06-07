use serde::{Deserialize, Serialize};

use crate::models::{CommerceOperationResponse};

/// Wallet adjustments create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WalletAdjustmentsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on wallet adjustments create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
