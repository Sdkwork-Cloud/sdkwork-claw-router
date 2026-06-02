use serde::{Deserialize, Serialize};

use crate::models::{CommerceRechargeSettingsResponse};

/// Recharges settings retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RechargesSettingsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on recharges settings retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceRechargeSettingsResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
