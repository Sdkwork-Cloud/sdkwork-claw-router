use serde::{Deserialize, Serialize};

use crate::models::{CommerceWalletTransactionItem};

/// Wallet operations retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WalletOperationsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on wallet operations retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceWalletTransactionItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
