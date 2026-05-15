use serde::{Deserialize, Serialize};

/// Commerce token balance response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceTokenBalanceResponse {
    /// Available tokens field on commerce token balance response.
    #[serde(rename = "availableTokens")]
    pub available_tokens: i64,

    /// Frozen tokens field on commerce token balance response.
    #[serde(rename = "frozenTokens")]
    pub frozen_tokens: i64,
}
