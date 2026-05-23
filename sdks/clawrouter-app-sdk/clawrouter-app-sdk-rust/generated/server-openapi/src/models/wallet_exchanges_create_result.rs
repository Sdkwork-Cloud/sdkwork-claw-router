use serde::{Deserialize, Serialize};

use crate::models::{CommerceOperationResponse};

/// Wallet exchanges create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WalletExchangesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on wallet exchanges create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
