use serde::{Deserialize, Serialize};

use crate::models::{CommerceWalletOverviewResponse};

/// Wallet overview retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WalletOverviewRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on wallet overview retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceWalletOverviewResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
