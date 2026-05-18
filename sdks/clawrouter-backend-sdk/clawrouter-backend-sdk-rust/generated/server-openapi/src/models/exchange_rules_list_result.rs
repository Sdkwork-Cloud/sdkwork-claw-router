use serde::{Deserialize, Serialize};

use crate::models::{CommerceExchangeRuleItem};

/// Exchange rules list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ExchangeRulesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on exchange rules list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<Vec<CommerceExchangeRuleItem>>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
