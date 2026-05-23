use serde::{Deserialize, Serialize};

use crate::models::{CommercePointsExchangeRateResponse};

/// Account points exchange rate retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountPointsExchangeRateRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on account points exchange rate retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePointsExchangeRateResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
