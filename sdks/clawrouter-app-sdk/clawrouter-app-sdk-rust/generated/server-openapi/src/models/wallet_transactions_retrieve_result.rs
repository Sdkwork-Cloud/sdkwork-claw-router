use serde::{Deserialize, Serialize};

use crate::models::{CommerceWalletTransactionItem};

/// Wallet transactions retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WalletTransactionsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on wallet transactions retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceWalletTransactionItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
